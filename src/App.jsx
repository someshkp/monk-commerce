import React, { useEffect, useState } from "react";
import Logo from "/monk-logo.jpg";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import ProductDialog from "./components/ProductDialog";

const App = () => {
  const [selectedProducts, setSelectedProducts] = useState([
    { id: 1, title: "Sample Product", variants: [] },
  ]);
  const [fetchedProducts, setFetchedProducts] = useState([]); // Store fetched products
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDialogProducts, setSelectedDialogProducts] = useState({});

  // useEffect(() => {
  //   setFetchedProducts([
  //     {
  //       id: 77,
  //       title: "Fog Linen Chambray Towel - Beige Stripe",
  //       variants: [
  //         { id: 1, product_id: 77, title: "XS / Silver", price: "49" },
  //         { id: 2, product_id: 77, title: "S / Silver", price: "49" },
  //         { id: 3, product_id: 77, title: "M / Silver", price: "49" },
  //       ],
  //       image: {
  //         id: 266,
  //         product_id: 77,
  //         src: "https://cdn11.bigcommerce.com/s-p1xcugzp89/products/77/images/266/foglinenbeigestripetowel1b.1647248662.386.513.jpg?c=1",
  //       },
  //     },
  //     {
  //       id: 80,
  //       title: "Orbit Terrarium - Large",
  //       variants: [
  //         { id: 64, product_id: 80, title: "Default Title", price: "109" },
  //       ],
  //       image: {
  //         id: 272,
  //         product_id: 80,
  //         src: "https://cdn11.bigcommerce.com/s-p1xcugzp89/products/80/images/272/roundterrariumlarge.1647248662.386.513.jpg?c=1",
  //       },
  //     },
  //   ]);
  // }, []);
  useEffect(() => {
    const url = `https://stageapi.monkcommerce.app/task/products/search?search=${searchQuery}&page=2&limit=1`;

    const fetchProducts = async () => {
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": import.meta.env.VITE_REACT_APP_API_KEY,
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log(data);
        setFetchedProducts(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchProducts();
  }, []);

  const handleOpenDialog = () => setIsDialogOpen(true);
  const handleCloseDialog = () => setIsDialogOpen(false);

  const handleAddProducts = (selected) => {
    console.log(selected);

    setSelectedProducts((prevSelectedProducts) => {
      console.log("Previous Selected Products:", prevSelectedProducts);
      const updatedProducts = Array.isArray(prevSelectedProducts)
        ? [...prevSelectedProducts]
        : [];

      selected.forEach((newProduct) => {
        const existingProductIndex = updatedProducts.findIndex(
          (product) => product.id === newProduct.id
        );

        if (existingProductIndex !== -1) {
          updatedProducts[existingProductIndex] = {
            id: newProduct.id,
            title: newProduct.title,
            variants: newProduct.variants,
          };
        } else {
          updatedProducts.push({
            id: newProduct.id,
            title: newProduct.title,
            variants: newProduct.variants,
          });
        }
      });

      return updatedProducts;
    });

    setSelectedDialogProducts({});
    handleCloseDialog();
  };

  const handleRemoveVariant = (productId, variantId) => {
    const updatedProducts = selectedProducts.map((product) => {
      if (product.id === productId) {
        return {
          ...product,
          variants: product.variants.filter(
            (variant) => variant.id !== variantId
          ),
        };
      }
      return product;
    });
    setSelectedProducts(updatedProducts);
  };

  // Function to add a discount to a product
  const handleAddDiscount = (id) => {
    const updatedProducts = selectedProducts.map((product) =>
      product.id === id
        ? {
            ...product,
            discount: { amount: product.discount?.amount || 0, type: "% off" },
          }
        : product
    );
    setSelectedProducts(updatedProducts);
  };

  // Function to handle discount change
  const handleDiscountChange = (id, key, value) => {
    const updatedProducts = selectedProducts.map((product) =>
      product.id === id
        ? { ...product, discount: { ...product.discount, [key]: value } }
        : product
    );
    setSelectedProducts(updatedProducts);
  };

  // Drag-and-drop functionality
  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(selectedProducts);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSelectedProducts(items);
  };

  const handleAddProduct = () => {
    if (!Array.isArray(selectedProducts)) {
      console.error("selectedProducts is not an array:", selectedProducts);
      return;
    }

    const newProduct = {
      id: Date.now().toString(),
      title: "New Product",
      variants: [],
    };

    setSelectedProducts([...selectedProducts, newProduct]);
  };

  return (
    <>
      <ProductDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        products={fetchedProducts}
        selectedProducts={selectedProducts}
        setSelectedProducts={setSelectedProducts}
        onSave={handleAddProducts}
      />
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex items-center mb-4">
          <img src={Logo} alt="Logo" className="w-8 h-8 mr-2" />
          <h1 className="text-2xl text-gray-500 font-bold">
            Monk Upsell & Cross-sell
          </h1>
        </div>
        <div className="w-full h-[1px] bg-gray-300 mb-6"></div>
        <div className="flex flex-col items-center justify-center">
          <div className="flex justify-start w-[40vw]">
            <h2 className="text-xl font-semibold mb-4">Add Products</h2>
          </div>
          <div className="flex justify-center flex-row gap-64 w-full mb-4">
            <div className="text-gray-700 font-medium text-sm">Product</div>
            <div className="text-gray-700 font-medium text-sm">Discount</div>
          </div>

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="products">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-4"
                >
                  {Array.isArray(selectedProducts) &&
                    selectedProducts.map((product, index) => (
                      <Draggable
                        key={product.id}
                        draggableId={product.id.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <>
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="flex items-center space-x-4"
                            >
                              <span className="w-6 text-gray-600 transform rotate-90 gap-1">
                                ::: {/* Drag handle */}
                              </span>
                              <div className="flex items-center border bg-white border-gray-300 px-3 py-2 w-full">
                                <input
                                  type="text"
                                  placeholder="Select Product"
                                  value={product.title}
                                  className="flex-1 text-gray-500 focus:outline-none"
                                  readOnly
                                />
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  width="24"
                                  height="24"
                                  onClick={() => handleOpenDialog()}
                                >
                                  <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4"></path>
                                  <path d="M13.5 6.5l4 4"></path>
                                </svg>
                              </div>

                              {/* Variants Section */}
                              <div className="w-[20rem]">
                                {product.discount ? (
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="number"
                                      value={product.discount.amount}
                                      onChange={(e) =>
                                        handleDiscountChange(
                                          product.id,
                                          "amount",
                                          e.target.value
                                        )
                                      }
                                      className="border border-gray-300 px-2 py-2 w-[5rem] rounded-sm"
                                    />
                                    <select
                                      value={product.discount.type}
                                      onChange={(e) =>
                                        handleDiscountChange(
                                          product.id,
                                          "type",
                                          e.target.value
                                        )
                                      }
                                      className="border border-gray-300 px-2 py-2 w-[5rem] rounded-sm"
                                    >
                                      <option value="% off">% off</option>
                                      <option value="flat off">Flat off</option>
                                    </select>
                                  </div>
                                ) : (
                                  <div className="mt-0">
                                    {" "}
                                    {/* Removed margin-top */}
                                    <button
                                      className="bg-emerald-700 text-white px-8 py-2 rounded-sm"
                                      onClick={() =>
                                        handleAddDiscount(product.id)
                                      }
                                    >
                                      Add Discount
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Nested Draggable Variants */}
                            <Droppable
                              droppableId={`variants-${product.id}`}
                              type="variant"
                            >
                              {(provided) => (
                                <div
                                  {...provided.droppableProps}
                                  ref={provided.innerRef}
                                  className="pl-8 space-y-2"
                                >
                                  {product.variants.map((variant, idx) => (
                                    <Draggable
                                      key={variant.id}
                                      draggableId={`variant-${variant.id}`}
                                      index={idx}
                                    >
                                      {(provided) => (
                                        <div
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                          className="flex items-center  px-3 py-2 rounded-md space-x-2"
                                        >
                                          <div className="flex items-center  border bg-white border-gray-300 rounded-full px-3 py-2 w-full">
                                            <input
                                              type="text"
                                              placeholder="Variant"
                                              value={variant.title}
                                              className="flex-1 text-gray-500 focus:outline-none"
                                              onChange={(e) =>
                                                handleVariantChange(
                                                  product.id,
                                                  variant.id,
                                                  e.target.value
                                                )
                                              }
                                            />
                                          </div>

                                          <button
                                            className="text-red-500"
                                            onClick={() =>
                                              handleRemoveVariant(
                                                product.id,
                                                variant.id
                                              )
                                            }
                                          >
                                            ✕
                                          </button>
                                        </div>
                                      )}
                                    </Draggable>
                                  ))}
                                  {provided.placeholder}
                                </div>
                              )}
                            </Droppable>
                          </>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <div className="flex justify-end w-[40vw]">
            <button
              onClick={handleAddProduct}
              className="mt-4 bg-transparent text-emerald-700 border-emerald-700 border-2 px-10 py-2 rounded-sm"
            >
              Add Product
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
