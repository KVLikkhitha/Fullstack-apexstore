import { useState, type ChangeEvent, type FormEvent } from "react";
import { FaTrash, FaUpload } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useEcommerce } from "../../../context/EcommerceContext";

const categories = [
  "Laptops",
  "Footwear",
  "Audio",
  "Cameras",
  "Wearables",
  "Mobile Phones",
  "Accessories",
];

const imgDefault =
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80";

const Productmanagement = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, updateProduct, deleteProduct } = useEcommerce();

  const currentProduct = products.find((p) => p.id === id);

  const [price, setPrice] = useState<number>(currentProduct?.price || 8999);
  const [stock, setStock] = useState<number>(currentProduct?.stock || 4);
  const [name, setName] = useState<string>(
    currentProduct?.name || "Nike Air Zoom Pegasus 39"
  );
  const [photo, setPhoto] = useState<string>(currentProduct?.photo || imgDefault);
  const [category, setCategory] = useState<string>(
    currentProduct?.category || "Footwear"
  );

  const [priceUpdate, setPriceUpdate] = useState<number>(price);
  const [stockUpdate, setStockUpdate] = useState<number>(stock);
  const [nameUpdate, setNameUpdate] = useState<string>(name);
  const [categoryUpdate, setCategoryUpdate] = useState<string>(category);
  const [photoUpdate, setPhotoUpdate] = useState<string>(photo);

  const [prevProductId, setPrevProductId] = useState<string | undefined>(id);

  if (currentProduct && currentProduct.id !== prevProductId) {
    setPrevProductId(currentProduct.id);
    setPrice(currentProduct.price);
    setStock(currentProduct.stock);
    setName(currentProduct.name);
    setPhoto(currentProduct.photo);
    setCategory(currentProduct.category);
    setPriceUpdate(currentProduct.price);
    setStockUpdate(currentProduct.stock);
    setNameUpdate(currentProduct.name);
    setCategoryUpdate(currentProduct.category);
    setPhotoUpdate(currentProduct.photo);
  }

  const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file: File | undefined = e.target.files?.[0];

    const reader: FileReader = new FileReader();

    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be under 5MB");
        return;
      }

      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setPhotoUpdate(reader.result);
          toast.success("New product photo loaded");
        }
      };
    }
  };

  const submitHandler = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!nameUpdate.trim()) {
      toast.error("Product name cannot be empty");
      return;
    }
    if (priceUpdate <= 0) {
      toast.error("Price must be greater than 0");
      return;
    }

    setName(nameUpdate);
    setPrice(priceUpdate);
    setStock(stockUpdate);
    setPhoto(photoUpdate);
    setCategory(categoryUpdate);

    if (id) {
      updateProduct(id, {
        name: nameUpdate,
        price: priceUpdate,
        stock: stockUpdate,
        category: categoryUpdate,
        photo: photoUpdate,
      });
    }

    toast.success("Product updated successfully!");
  };

  const deleteHandler = () => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      if (id) deleteProduct(id);
      setTimeout(() => {
        navigate("/admin/product");
      }, 500);
    }
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        {/* Left Live Preview Section */}
        <section className="product-live-preview">
          <div className="preview-header">
            <span className="sku-badge">SKU: {id || "prod-001"}</span>
            <span
              className={
                stock <= 0
                  ? "status-pill out-of-stock"
                  : stock < 5
                  ? "status-pill low-stock"
                  : "status-pill in-stock"
              }
            >
              {stock <= 0 ? "Out of Stock" : `${stock} Available`}
            </span>
          </div>

          <div className="img-container">
            <img src={photo} alt={name} />
          </div>

          <span className="category-chip" style={{ margin: "0 auto" }}>
            {category}
          </span>
          <p className="product-title">{name}</p>
          <h3 className="product-price">
            ₹{price.toLocaleString("en-IN")}
          </h3>
        </section>

        {/* Right Edit Form Section */}
        <article className="product-edit-card">
          <button
            type="button"
            className="product-delete-btn"
            onClick={deleteHandler}
            title="Delete Product"
          >
            <FaTrash />
          </button>

          <form onSubmit={submitHandler}>
            <h2>Manage Product</h2>

            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                placeholder="Name"
                value={nameUpdate}
                onChange={(e) => setNameUpdate(e.target.value)}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Price (₹)</label>
                <input
                  type="number"
                  placeholder="Price"
                  value={priceUpdate}
                  onChange={(e) => setPriceUpdate(Number(e.target.value))}
                  min={1}
                  required
                />
              </div>

              <div className="form-group">
                <label>Stock</label>
                <input
                  type="number"
                  placeholder="Stock"
                  value={stockUpdate}
                  onChange={(e) => setStockUpdate(Number(e.target.value))}
                  min={0}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                value={categoryUpdate}
                onChange={(e) => setCategoryUpdate(e.target.value)}
                className="custom-select"
                required
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Update Photo</label>
              <div className="file-upload-zone">
                <input
                  type="file"
                  id="edit-photo-file"
                  accept="image/*"
                  onChange={changeImageHandler}
                />
                <label htmlFor="edit-photo-file" className="upload-label">
                  <FaUpload />
                  <span>Choose new photo...</span>
                </label>
              </div>
            </div>

            <button type="submit" className="submit-btn">
              Save Changes
            </button>
          </form>
        </article>
      </main>
    </div>
  );
};

export default Productmanagement;
