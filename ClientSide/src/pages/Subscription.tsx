import { useState, useEffect, useMemo } from 'react';
import { CreditCard, Star, Check } from 'lucide-react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

type UserType = {
  id: number;
  name: string;
  email: string;
  image?: string;
  bio?: string;
  credits?: number;
};

type PlanType = {
  id: string;
  name: string;
  credits: number;
  price: number;
  price_rupees: number;
};

type OrderResponse = {
  order_id: string;
  amount: number;
  currency: string;
  credits: number;
  description: string;
};

function Subscription({ userdata }: { userdata: string | null }) {
  const [plans, setPlans] = useState<PlanType[]>([]);
  const [loading, setLoading] = useState(false);
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);
  const [userCredits, setUserCredits] = useState<number>(0);

  const parsedUser = useMemo<UserType | null>(() => {
    if (!userdata) return null;
    try {
      return JSON.parse(userdata);
    } catch {
      return null;
    }
  }, [userdata]);

  // Load Razorpay script
  useEffect(() => {
    console.log(parsedUser.id)
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        if (window.Razorpay) {
          resolve(true);
          return;
        }
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
    };

    loadRazorpayScript();
  }, []);

  // Fetch subscription plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch('http://localhost:8080/subscription/plans');
        if (response.ok) {
          const data = await response.json();
          setPlans(data.plans || []);
        }
      } catch (error) {
        console.error('Failed to fetch plans:', error);
      }
    };

    fetchPlans();
  }, []);

  // Fetch user credits
  useEffect(() => {
    const fetchUserCredits = async () => {
      if (!parsedUser) return;
      
      try {
        const response = await fetch(`http://localhost:8080/user/${parsedUser.id}/credits`);
        if (response.ok) {
          const data = await response.json();
          setUserCredits(data.credits || 0);
        }
      } catch (error) {
        console.error('Failed to fetch user credits:', error);
      }
    };

    fetchUserCredits();
  }, [parsedUser]);

  const handleSubscribe = async (planId: string) => {
    if (!parsedUser) {
      alert('Please login to purchase credits');
      return;
    }

    if (!window.Razorpay) {
      alert('Payment system is not loaded. Please refresh and try again.');
      return;
    }

    setProcessingPlan(planId);
    setLoading(true);

    try {
      // Create order
      const orderResponse = await fetch(`http://localhost:8080/user/${parsedUser.id}/subscription/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan_type: planId }),
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to create order');
      }

      const orderData: OrderResponse = await orderResponse.json();

      // Configure Razorpay options
      const options = {
        key: 'rzp_test_1mUU1xAnklgEiv', // Replace with your Razorpay Key ID
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'FileSharing Credits',
        description: orderData.description,
        image: '/logo.png', // Optional: Add your logo
        order_id: orderData.order_id,
        handler: async (response: any) => {
          // Payment successful callback
          await verifyPayment(response);
        },
        prefill: {
          name: parsedUser.name,
          email: parsedUser.email,
        },
        notes: {
          credits: orderData.credits,
          plan_id: planId,
        },
        theme: {
          color: '#3B82F6',
        },
        modal: {
          ondismiss: () => {
            setProcessingPlan(null);
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment initiation failed:', error);
      alert('Failed to initiate payment. Please try again.');
      setProcessingPlan(null);
      setLoading(false);
    }
  };

  const verifyPayment = async (paymentResponse: any) => {
    if (!parsedUser) return;

    try {
      const verifyResponse = await fetch(`http://localhost:8080/user/${parsedUser.id}/subscription/verify-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          razorpay_order_id: paymentResponse.razorpay_order_id,
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_signature: paymentResponse.razorpay_signature,
        }),
      });

      if (verifyResponse.ok) {
        const verifyData = await verifyResponse.json();
        if (verifyData.success) {
          // Update user credits in local state
          setUserCredits(verifyData.total_credits);
          
          // Update localStorage if needed
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            const userData = JSON.parse(storedUser);
            userData.credits = verifyData.total_credits;
            localStorage.setItem('user', JSON.stringify(userData));
          }

          alert(`Payment successful! ${verifyData.credits_added} credits have been added to your account.`);
        } else {
          alert('Payment verification failed: ' + verifyData.message);
        }
      } else {
        throw new Error('Payment verification failed');
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      alert('Payment verification failed. Please contact support if money was deducted.');
    } finally {
      setProcessingPlan(null);
      setLoading(false);
    }
  };

  const getPlanFeatures = (planId: string) => {
    const features = {
      plan_500: [
        'Upload up to 5000 files',
        'Basic cloud storage',
        'Standard support',
        '30 days retention',
      ],
      plan_1000: [
        'Upload up to 10000 files',
        'Premium cloud storage',
        'Priority support',
        '90 days retention',
        'Advanced analytics',
        'Bulk operations',
      ],
    };
    return features[planId as keyof typeof features] || [];
  };

  if (!parsedUser) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-3xl font-bold mb-6">Subscription Plans</h1>
        <p className="text-lg mb-6">Please login to view and purchase subscription plans.</p>
        <button className="btn btn-primary">Login</button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-lg text-gray-600 mb-6">
          Select a credit plan that suits your file sharing needs. Each credit allows you to upload and share files.
        </p>
        <div className="bg-blue-50 p-4 rounded-lg inline-block">
          <p className="text-lg font-semibold text-blue-800">
            Current Balance: <span className="text-2xl">{userCredits}</span> credits
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`card bg-base-100 shadow-xl border-2 ${
              plan.id === 'plan_1000' ? 'border-primary' : 'border-base-300'
            } relative`}
          >
            {plan.id === 'plan_1000' && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="badge badge-primary gap-2">
                  <Star size={12} fill="currentColor" />
                  Most Popular
                </span>
              </div>
            )}
            
            <div className="card-body text-center">
              <div className="flex justify-center mb-4">
                <CreditCard size={48} className="text-primary" />
              </div>
              
              <h2 className="card-title text-2xl justify-center mb-2">
                {plan.name}
              </h2>
              
              <div className="mb-4">
                <span className="text-4xl font-bold">₹{plan.price_rupees}</span>
                <p className="text-sm text-gray-600 mt-1">
                  {plan.credits} credits
                </p>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-3">What's included:</p>
                <ul className="text-left space-y-2">
                  {getPlanFeatures(plan.id).map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check size={16} className="text-success" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                className={`btn w-full ${
                  plan.id === 'plan_1000' ? 'btn-primary' : 'btn-outline'
                } ${processingPlan === plan.id ? 'loading' : ''}`}
                onClick={() => handleSubscribe(plan.id)}
                disabled={loading}
              >
                {processingPlan === plan.id ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  <>
                    <CreditCard size={16} />
                    Buy Credits
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <div className="divider">Need Help?</div>
        <p className="text-sm text-gray-600 mb-4">
          Credits are used for file uploads. Each MB costs 0.1 credits (minimum 0.5, maximum 5 credits per file).
        </p>
        <div className="flex justify-center gap-4 text-sm">
          <span className="badge badge-outline">Secure Payment</span>
          <span className="badge badge-outline">Instant Credit Addition</span>
          <span className="badge badge-outline">24/7 Support</span>
        </div>
      </div>
    </div>
  );
}

export default Subscription;