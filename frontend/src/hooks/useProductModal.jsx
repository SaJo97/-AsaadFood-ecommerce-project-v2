import { useMemo } from "react";
import { useNavigate, useParams } from "react-router";

const useProductModal = (products, basePath) => {
  const navigate = useNavigate();
  const { productId } = useParams();

  const selectedProduct = useMemo(() => {
    if (!productId || !products) return null;
    return products.find((p) => p._id === productId);
  }, [productId, products]);

  const openProduct = (id) => {
    navigate(`${basePath}/${id}`);
  };

  const closeProduct = () => {
    navigate(basePath);
  };

  return { selectedProduct, openProduct, closeProduct };
};

export default useProductModal;
