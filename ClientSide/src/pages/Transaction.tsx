import { useState, useEffect,useMemo} from 'react';

// Type definitions

type UserType = {
  id: number;
  name: string;
  email: string;
  image?: string;
  bio?: string;
  credits?: number;
};


interface Transaction {
  id: number;
  date: string;
  type: 'purchase' | 'usage' | 'refund';
  amount: number;
  credits: number;
  description: string;
  status: 'completed' | 'pending' | 'failed';
}

interface TransactionsResponse {
  transactions: Transaction[];
  total: number;
  limit: number;
  offset: number;
  user_id: number;
  current_credits: number;
}

interface PaginationState {
  total: number;
  limit: number;
  offset: number;
}

function Transactions({ userval }: { userval: string | null }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentCredits, setCurrentCredits] = useState<number>(0);
  const [pagination, setPagination] = useState<PaginationState>({
    total: 0,
    limit: 10,
    offset: 0
  });
  const [selectedTransactions, setSelectedTransactions] = useState<Set<number>>(new Set());

  // Get user ID - you might get this from context, props, or auth
  // const userId = 1; // Replace with actual user ID from your auth system
  const parsedUser = useMemo<UserType | null>(() => {
        if (!userval) return null;
        try {
          return JSON.parse(userval);
        } catch {
          return null;
        }
      }, [userval]);

  useEffect(() => {
    fetchTransactions();
  }, [pagination.offset, pagination.limit]);

  const fetchTransactions = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:8080/user/${parsedUser.id}/transactions?limit=${pagination.limit}&offset=${pagination.offset}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }
      
      const data: TransactionsResponse = await response.json();
      setTransactions(data.transactions || []);
      setCurrentCredits(data.current_credits || 0);
      setPagination(prev => ({
        ...prev,
        total: data.total || 0
      }));
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.checked) {
      setSelectedTransactions(new Set(transactions.map(t => t.id)));
    } else {
      setSelectedTransactions(new Set());
    }
  };

  const handleSelectTransaction = (id: number): void => {
    const newSelected = new Set(selectedTransactions);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedTransactions(newSelected);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionTypeIcon = (type: Transaction['type']): string => {
    switch (type) {
      case 'purchase':
        return '💰';
      case 'usage':
        return '📤';
      case 'refund':
        return '↩️';
      default:
        return '📊';
    }
  };

  const getTransactionTypeColor = (type: Transaction['type']): string => {
    switch (type) {
      case 'purchase':
        return 'text-success';
      case 'usage':
        return 'text-error';
      case 'refund':
        return 'text-info';
      default:
        return 'text-base-content';
    }
  };

  const getStatusBadgeClass = (status: Transaction['status']): string => {
    switch (status) {
      case 'completed':
        return 'badge badge-success badge-sm';
      case 'pending':
        return 'badge badge-warning badge-sm';
      case 'failed':
        return 'badge badge-error badge-sm';
      default:
        return 'badge badge-ghost badge-sm';
    }
  };

  const getTransactionDisplayText = (transaction: Transaction): { title: string; subtitle: string } => {
    switch (transaction.type) {
      case 'purchase':
        // Extract plan name from description for subscription purchases
        const planMatch = transaction.description.match(/Credits purchased - (.+?) \(/);
        const planName = planMatch ? planMatch[1] : 'Subscription Plan';
        return {
          title: 'Subscription Purchase',
          subtitle: planName
        };
      case 'usage':
        return {
          title: 'Credits Used',
          subtitle: transaction.description
        };
      case 'refund':
        return {
          title: 'Refund Processed',
          subtitle: transaction.description
        };
      default:
        return {
          title: transaction.type,
          subtitle: transaction.description
        };
    }
  };

  const handlePrevPage = (): void => {
    if (pagination.offset > 0) {
      setPagination(prev => ({
        ...prev,
        offset: Math.max(0, prev.offset - prev.limit)
      }));
    }
  };

  const handleNextPage = (): void => {
    if (pagination.offset + pagination.limit < pagination.total) {
      setPagination(prev => ({
        ...prev,
        offset: prev.offset + prev.limit
      }));
    }
  };

  const handleExportSelected = (): void => {
    const selectedData = transactions.filter(t => selectedTransactions.has(t.id));
    const csvContent = [
      ['Date', 'Type', 'Amount', 'Credits', 'Description', 'Status'].join(','),
      ...selectedData.map(t => [
        t.date,
        t.type,
        t.amount.toString(),
        t.credits.toString(),
        `"${t.description}"`,
        t.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Transactions</h1>
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Transactions</h1>
        <div className="alert alert-error">
          <span>Error: {error}</span>
          <button className="btn btn-sm" onClick={fetchTransactions}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Transactions</h1>
        <div className="stats shadow">
        </div>
      </div>
      
      <p className="mb-6 text-base-content/70">
        View your subscription purchases and credit usage history.
      </p>

      {transactions.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">💳</div>
          <h3 className="text-xl font-semibold mb-2">No transactions yet</h3>
          <p className="text-base-content/70">
            Your subscription purchases and credit usage will appear here.
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>
                    <label>
                      <input 
                        type="checkbox" 
                        className="checkbox" 
                        checked={selectedTransactions.size === transactions.length && transactions.length > 0}
                        onChange={handleSelectAll}
                      />
                    </label>
                  </th>
                  <th>Transaction</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Credits</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => {
                  const displayText = getTransactionDisplayText(transaction);
                  return (
                    <tr key={transaction.id}>
                      <th>
                        <label>
                          <input 
                            type="checkbox" 
                            className="checkbox"
                            checked={selectedTransactions.has(transaction.id)}
                            onChange={() => handleSelectTransaction(transaction.id)}
                          />
                        </label>
                      </th>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar placeholder">
                            <div className="bg-neutral text-neutral-content rounded-full w-12 h-12 flex items-center justify-center">
                              <span className="text-xl">
                                {getTransactionTypeIcon(transaction.type)}
                              </span>
                            </div>
                          </div>
                          <div>
                            <div className="font-bold">
                              {displayText.title}
                            </div>
                            <div className="text-sm opacity-50">
                              {formatDate(transaction.date)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="font-medium">
                          {displayText.subtitle}
                        </div>
                        <div className="text-sm opacity-50">
                          ID: {transaction.id}
                        </div>
                      </td>
                      <td>
                        <div className={`font-semibold ${getTransactionTypeColor(transaction.type)}`}>
                          {transaction.type === 'purchase' || transaction.type === 'refund' ? '+' : '-'}
                          {formatCurrency(Math.abs(transaction.amount))}
                        </div>
                      </td>
                      <td>
                        {/* <div className={`font-semibold ${
                          transaction.credits > 0 ? 'text-success' : 'text-error'
                        }`}>
                          {transaction.credits > 0 ? '+' : ''}{transaction.credits.toLocaleString()}
                        </div> */}
                      </td>
                      <td>
                        <span className={getStatusBadgeClass(transaction.status)}>
                          {transaction.status}
                        </span>
                      </td>
                      <th>
                        <div className="dropdown dropdown-end">
                          <div tabIndex={0} role="button" className="btn btn-ghost btn-xs">
                            details
                          </div>
                          <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                            <li><a onClick={() => alert(`Transaction ID: ${transaction.id}\nDescription: ${transaction.description}`)}>View Details</a></li>
                            {transaction.type === 'purchase' && (
                              <li><a onClick={() => alert('Receipt will be sent to your email')}>Download Receipt</a></li>
                            )}
                          </ul>
                        </div>
                      </th>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-base-content/70">
              Showing {pagination.offset + 1} to {Math.min(pagination.offset + pagination.limit, pagination.total)} of {pagination.total} transactions
            </div>
            <div className="join">
              <button 
                className="join-item btn btn-sm"
                onClick={handlePrevPage}
                disabled={pagination.offset === 0}
              >
                Previous
              </button>
              <button 
                className="join-item btn btn-sm"
                onClick={handleNextPage}
                disabled={pagination.offset + pagination.limit >= pagination.total}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      {/* Actions for selected transactions */}
      {selectedTransactions.size > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2">
          <div className="bg-primary text-primary-content px-6 py-3 rounded-full shadow-lg flex items-center gap-4">
            <span>{selectedTransactions.size} selected</span>
            <button 
              className="btn btn-sm btn-ghost text-primary-content"
              onClick={handleExportSelected}
            >
              Export CSV
            </button>
            <button 
              className="btn btn-sm btn-ghost text-primary-content"
              onClick={() => setSelectedTransactions(new Set())}
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Transactions;