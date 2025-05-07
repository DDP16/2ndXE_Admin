import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  User,
  Clock,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    // This would normally fetch from an API
    // For now, we'll use mock data
    const postData = {
      id: parseInt(id),
      title: "Audi e-tron Premium",
      make: "Audi",
      year: 2022,
      mileage: 160000,
      price: 100945.0,
      images: [
        `https://picsum.photos/600/600?random=${1}`,
        `https://picsum.photos/600/600?random=${2}`,
        `https://picsum.photos/600/600?random=${3}`,
        `https://picsum.photos/600/600?random=${4}`,
      ],
      status: "Available",
      daysLeft: 28,
      description:
        "This premium Audi e-tron is an exceptional electric SUV that combines luxury with high-performance electric driving. Featuring a spacious interior, state-of-the-art technology, and impressive range, it's the perfect choice for eco-conscious drivers who don't want to compromise on comfort and style.",
      seller: "John Smith",
      location: "San Francisco, CA",
      postedDate: "2023-04-15",
      features: [
        "Electric Drivetrain",
        "Premium Sound System",
        "Panoramic Sunroof",
        "Advanced Driver Assistance",
        "Heated/Ventilated Seats",
        "Wireless Charging",
      ],
      specifications: {
        Loại: "Nước ngọt",
        "Ngày sản xuất": "01/01/2025",
        "Nhà cung cấp": "ABCD Supplier",
        "Ngày hết hạn": "01/01/2026",
        "Số lượng": "100 Thùng",
        "Trạng thái": "IN_STOCK",
      },
    };

    setTimeout(() => {
      setPost(postData);
      setLoading(false);
    }, 500);
  }, [id]);

  const handleThumbnailClick = (index) => {
    setActiveImage(index);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
        <button
          onClick={() => navigate("/posts")}
          className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors"
        >
          Back to Posts
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Back Button */}
        <button
          onClick={() => navigate("/posts")}
          className="flex items-center text-gray-600 hover:text-orange-500 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          <span>Back to Posts</span>
        </button>

        {/* Main Content - Grid Layout for clear separation */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 overflow-hidden h-[80vh] min-h-0">
          {/* Left Column - Image Gallery (2/5 of the grid) */}
          <div className="lg:col-span-2 bg-white rounded-lg overflow-hidden shadow-md h-full justify-evenly flex flex-col">
            {/* Main Image */}
            <div>
                <div className="relative aspect-[4/3]">
                <img
                    src={post.images[activeImage]}
                    alt={post.title}
                    className="w-full h-full object-cover"
                />
                <div
                    className={`absolute top-4 right-4 px-3 py-1 rounded-md text-sm bg-orange-500 text-white`}
                >
                    {post.status}
                </div>

                {/* Image Navigation Controls */}
                {post.images.length > 1 && (
                    <>
                    <button
                        onClick={() =>
                        setActiveImage((prev) =>
                            prev === 0 ? post.images.length - 1 : prev - 1
                        )
                        }
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full"
                        aria-label="Previous image"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() =>
                        setActiveImage((prev) =>
                            prev === post.images.length - 1 ? 0 : prev + 1
                        )
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full"
                        aria-label="Next image"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                    </>
                )}
                </div>
            </div>

            {/* Smaller Thumbnails in a neat row */}
            {post.images.length > 1 && (
              <div className="p-2 flex gap-1 overflow-x-auto">
                {post.images.map((img, idx) => (
                  <div
                    key={idx}
                    className={`cursor-pointer flex-shrink-0 w-[10vw] h-[10vw] ${
                      activeImage === idx
                        ? "ring-2 ring-orange-500 rounded-md"
                        : "opacity-70"
                    }`}
                    onClick={() => handleThumbnailClick(idx)}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Details (3/5 of the grid) */}
          <div className="lg:col-span-3 flex flex-col gap-4 overflow-y-auto h-full">
            {/* Product Main Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h1 className="text-3xl font-bold">{post.title}</h1>
              <div className="text-2xl font-bold text-orange-500 mt-2">
                ${post.price.toLocaleString()}
              </div>
              <p className="text-gray-500 mt-1">
                {post.make} - {post.year} - {post.mileage}km
              </p>

              <div className="flex items-center mt-4 text-orange-500">
                <Clock className="w-4 h-4 mr-2" />
                <span>{post.daysLeft} days left</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 text-sm">
                <div className="flex items-center text-gray-500">
                  <User className="w-4 h-4 mr-2" />
                  <span>Seller: {post.seller}</span>
                </div>
                <div className="flex items-center text-gray-500">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Posted: {post.postedDate}</span>
                </div>
                <div className="flex items-center text-gray-500">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>Location: {post.location}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Description</h2>
              <p className="text-gray-700">{post.description}</p>
            </div>

            {/* Specifications */}
            {/* <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Specifications</h2>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(post.specifications).map(
                  ([key, value], idx) => (
                    <div key={idx} className="flex flex-col">
                      <span className="text-gray-500 text-sm">{key}</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  )
                )}
              </div>
            </div> */}

            {/* Features */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Features</h2>
              <div className="grid grid-cols-2 gap-3">
                {post.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-md font-medium transition-colors">
                Contact Seller
              </button>
              <button className="flex-1 border border-orange-500 text-orange-500 hover:bg-orange-50 py-3 px-4 rounded-md font-medium transition-colors">
                Add to Favorites
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
