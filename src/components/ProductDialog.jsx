const ProductDialog = ({
  isOpen,
  onClose,
  searchQuery,
  setSearchQuery,
  products,
  selectedProducts,
  setSelectedProducts,
  onSave, // Receive the save function
}) => {
  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const toggleProductSelection = (productId, variantId = null) => {
    setSelectedProducts((prev) => {
      const updated = { ...prev };
      const product = products.find((p) => p.id === productId);

      if (variantId) {
        if (updated[productId]) {
          const isVariantSelected = updated[productId].some(
            (v) => v.id === variantId
          );

          if (isVariantSelected) {
            updated[productId] = updated[productId].filter(
              (v) => v.id !== variantId
            );
          } else {
            updated[productId].push({ id: variantId });
          }

          if (updated[productId].length === 0) {
            delete updated[productId];
          }
        } else {
          updated[productId] = [{ id: variantId }];
        }
      } else {
        if (updated[productId]) {
          delete updated[productId];
        } else {
          updated[productId] = product.variants.map((v) => ({ id: v.id }));
        }
      }

      return updated;
    });
  };

  const isSelected = (productId, variantId = null) => {
    if (!selectedProducts || typeof selectedProducts !== "object") return null;

    const productSelection = selectedProducts[productId];

    if (!productSelection || !Array.isArray(productSelection)) return null;

    if (variantId) {
      const variant = productSelection.find((v) => v.id === variantId);
      return variant || null;
    }
    return productSelection;
  };

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = () => {
    const transformedData = Object.entries(selectedProducts)
      .map(([productId, variantIds]) => {
        const product = products.find((p) => p.id === parseInt(productId));

        if (!product) {
          console.warn(
            `Product with ID ${productId} not found in products list.`
          );
          return null;
        }

        return {
          id: product.id,
          title: product.title,
          variants: product.variants.filter((variant) =>
            variantIds.some((v) => v.id === variant.id)
          ),
        };
      })
      .filter(Boolean);

    onSave(transformedData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div className="bg-white rounded-lg shadow-lg w-[40rem]">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Select Products</h2>
          <button onClick={onClose} className="text-gray-500 text-xl">
            ✕
          </button>
        </div>

        <div className="p-4">
          <input
            type="text"
            placeholder="Search product"
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
          <div className="space-y-4 max-h-[20rem] overflow-y-auto mt-4">
            {filteredProducts.map((product) => (
              <div key={product.id} className="border-b pb-2">
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    checked={isSelected(product.id)}
                    onChange={() => toggleProductSelection(product.id)}
                    className="form-checkbox"
                  />
                  <div className="flex items-center space-x-4">
                    <h3 className="font-semibold">{product.title}</h3>
                    {product.image && (
                      <img
                        src={product.image.src}
                        alt={product.title}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                    )}
                  </div>
                </div>

                {product.variants?.map((variant) => (
                  <div
                    key={variant.id}
                    className="pl-6 flex justify-between items-center  mt-2"
                  >
                    <div className="space-x-2">
                      <input
                        type="checkbox"
                        checked={isSelected(product.id, variant.id)}
                        onChange={() =>
                          toggleProductSelection(product.id, variant.id)
                        }
                        className="form-checkbox"
                      />
                      <span>{variant.title}</span>
                    </div>
                    <div>
                      <span>{variant.inventory_quantity} available</span>
                    </div>
                    <div>
                      <span className="text-gray-500">
                        ${parseFloat(variant.price).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="mr-2 px-4 py-2 border rounded-md text-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-green-600 text-white rounded-md"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDialog;
