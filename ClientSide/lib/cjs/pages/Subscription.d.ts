declare global {
    interface Window {
        Razorpay: any;
    }
}
declare function Subscription({ userdata }: {
    userdata: string | null;
}): import("react/jsx-runtime").JSX.Element;
export default Subscription;
