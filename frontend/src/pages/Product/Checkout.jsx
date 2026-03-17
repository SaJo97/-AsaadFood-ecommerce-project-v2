import ShoppingCart from "./components/ShoppingCart";
const Checkout = () => {
  return (
    <>
      {/* SEO Metadata */}
      <title>Varukorg | Asaad Food</title>
      <meta name="description" content="Din varukorg hos Asaad Food. Granska dina produkter & justera kvantiteter." />

      <main className="mt-2.5 flex flex-col items-center" role="main" aria-labelledby="checkout-heading">
        <div className="rounded-2xl bg-white w-full max-w-225">
          <ShoppingCart isCheckoutPage />
        </div>
      </main>
    </>
  );
};
export default Checkout;
