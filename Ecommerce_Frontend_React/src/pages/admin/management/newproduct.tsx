import { useState, type ChangeEvent, type FormEvent } from "react";
import toast from "react-hot-toast";
import { FaUpload, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
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

const NewProduct = () => {
  const navigate = useNavigate();
  const { addProduct } = useEcommerce();
  const [name, setName] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [price, setPrice] = useState<number | "">("");
  const [stock, setStock] = useState<number | "">("");
  const [photoPrev, setPhotoPrev] = useState<string>("");
  const [photo, setPhoto] = useState<File>();

  const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file: File | undefined = e.target.files?.[0];

    const reader: FileReader = new FileReader();

    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image file size must be less than 5MB");
        return;
      }

      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setPhotoPrev(reader.result);
          setPhoto(file);
          toast.success("Image preview loaded!");
        }
      };
    }
  };

  const removeImage = () => {
    setPhotoPrev("");
    setPhoto(undefined);
  };

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter a product name");
      return;
    }
    if (!price || Number(price) <= 0) {
      toast.error("Please enter a valid price");
      return;
    }
    if (stock === "" || Number(stock) < 0) {
      toast.error("Please enter initial stock quantity");
      return;
    }
    if (!category) {
      toast.error("Please select a category");
      return;
    }

    addProduct({
      name: name.trim(),
      category,
      price: Number(price),
      stock: Number(stock),
      photo:
        photoPrev ||
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      description: `${name.trim()} - newly introduced premium SKU. Verified manufacturer warranty and genuine hardware.`,
      rating: 5.0,
      reviewCount: 0,
      featured: true,
    });

    setTimeout(() => {
      navigate("/admin/product");
    }, 800);
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        <article className="new-product-card">
          <form onSubmit={submitHandler}>
            <h2>Create New Product</h2>

            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                placeholder="e.g. Sony WH-1000XM5 Headphones"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Price (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 29990"
                  value={price}
                  onChange={(e) =>
                    setPrice(e.target.value ? Number(e.target.value) : "")
                  }
                  min={1}
                  required
                />
              </div>

              <div className="form-group">
                <label>Stock Quantity</label>
                <input
                  type="number"
                  placeholder="e.g. 25"
                  value={stock}
                  onChange={(e) =>
                    setStock(e.target.value ? Number(e.target.value) : "")
                  }
                  min={0}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="custom-select"
              >
                <option value="">Select category...</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Product Image</label>
              <div className="file-upload-zone">
                <input
                  type="file"
                  id="product-photo"
                  accept="image/*"
                  onChange={changeImageHandler}
                />
                <label htmlFor="product-photo" className="upload-label">
                  <FaUpload />
                  <span>
                    {photo ? photo.name : "Choose an image or drag here"}
                  </span>
                </label>
              </div>
            </div>

            {photoPrev && (
              <div className="image-preview-box">
                <img src={photoPrev} alt="Preview" />
                <button
                  type="button"
                  className="remove-img-btn"
                  onClick={removeImage}
                  title="Remove image"
                >
                  <FaTimes />
                </button>
              </div>
            )}

            <button type="submit" className="submit-btn">
              Create Product
            </button>
          </form>
        </article>
      </main>
    </div>
  );
};

export default NewProduct;
