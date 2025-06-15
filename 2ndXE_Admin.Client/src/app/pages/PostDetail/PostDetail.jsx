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
  Mail,
  Phone,
  Briefcase,
  Fuel,
  Gauge,
  RotateCcw,
} from "lucide-react";
import { message, Spin, Modal, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchPostById } from "../../modules/services/Post";
import { fetchAccountById } from "../../modules/services/Account";

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [error, setError] = useState(null);
  const [seller, setSeller] = useState(null);
  const [contactModalVisible, setContactModalVisible] = useState(false);

  useEffect(() => {
    const getPostData = async () => {
      setLoading(true);
      try {
        const postData = await dispatch(fetchPostById(id)).unwrap();
        if (postData) {
          // Format the post data for display
          const formattedPost = {
            ...postData,
            images: postData.imageURL || [],
            postedDate: new Date(postData.created_at)
              .toISOString()
              .split("T")[0],
            location: postData.location || "Not specified",
            features: postData.features
              ? typeof postData.features === "string"
                ? JSON.parse(postData.features)
                : postData.features
              : [],
            daysLeft: postData.expire_at
              ? Math.ceil(
                  (new Date(postData.expire_at) - new Date()) /
                    (1000 * 60 * 60 * 24)
                )
              : 0,
            vehicle_type: postData.vehicle_type || "Not specified",
            engine_capacity: postData.engine_capacity || "Not specified",
            transmission: postData.transmission || "Not specified",
            fuel_type: postData.fuel_type || "Not specified",
          };
          setPost(formattedPost);

          // Fetch seller information if user_id is available
          if (postData.user_id) {
            try {
              const userData = await dispatch(
                fetchAccountById(postData.user_id)
              ).unwrap();
              setSeller(userData);
            } catch (userErr) {
              console.error("Error fetching user data:", userErr);
              // Set a default seller with unknown information
              setSeller({
                full_name: "Unknown Seller",
                email: "Not available",
                phone: "Not available",
              });
            }
          }
        } else {
          setError("Post not found");
        }
      } catch (err) {
        console.error("Error fetching post:", err);
        setError(err.message || "Failed to load post data");
        message.error(
          "Failed to load post: " + (err.message || "Unknown error")
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      getPostData();
    }
  }, [id, dispatch]);

  const handleThumbnailClick = (index) => {
    setActiveImage(index);
  };

  const showContactModal = () => {
    setContactModalVisible(true);
  };

  const hideContactModal = () => {
    setContactModalVisible(false);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <h1 className="text-2xl font-bold mb-4">{error || "Post Not Found"}</h1>
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
    <div className="p-2 md:p-4 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Back Button */}
        <button
          onClick={() => navigate("/posts")}
          className="flex items-center text-gray-600 hover:text-orange-500 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          <span>Back to Posts</span>
        </button>

        {/* Main Content - Grid Layout for clear separation */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 overflow-hidden h-[90vh] min-h-0">
          {/* Left Column - Image Gallery (2/5 of the grid) */}
          <div className="lg:col-span-2 bg-white rounded-lg overflow-hidden shadow-md h-full justify-evenly flex flex-col">
            {/* Main Image */}
            <div>
              <div className="relative aspect-[4/3]">
                {post.images && post.images.length > 0 ? (
                  <img
                    src={post.images[activeImage]}
                    alt={post.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Use a more reliable placeholder or a base64 encoded image
                      e.target.src =
                        "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22300%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20300%20200%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_1892af0fb3e%20text%20%7B%20fill%3A%23AAAAAA%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A15pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_1892af0fb3e%22%3E%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23EEEEEE%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22110.0078125%22%20y%3D%22106.5%22%3ENo Image%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E";
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <p className="text-gray-500 font-medium">
                      No Image Available
                    </p>
                  </div>
                )}
                <div
                  className={`absolute top-4 right-4 px-3 py-1 rounded-md text-sm bg-orange-500 text-white`}
                >
                  {post.status}
                </div>

                {/* Image Navigation Controls */}
                {post.images && post.images.length > 1 && (
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
            {post.images && post.images.length > 1 && (
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
                      onError={(e) => {
                        e.target.src =
                          "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22300%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20300%20200%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_1892af0fb3e%20text%20%7B%20fill%3A%23AAAAAA%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A15pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_1892af0fb3e%22%3E%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23EEEEEE%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22110.0078125%22%20y%3D%22106.5%22%3ENo Image%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E";
                      }}
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
              <h1 className="text-3xl font-bold">{post.title}</h1>{" "}
              <div className="text-2xl font-bold text-orange-500 mt-2">
                {typeof post.price === "number"
                  ? post.price.toLocaleString()
                  : post.price} VND
              </div>
              <p className="text-gray-500 mt-1">
                {post.brand} {post.model && `- ${post.model}`}{" "}
                {post.year && `- ${post.year}`}{" "}
                {post.mileage && `- ${post.mileage}km`}
              </p>
              <div className="flex items-center mt-4 text-orange-500">
                <Clock className="w-4 h-4 mr-2" />
                <span>{post.daysLeft} days left</span>
              </div>
              {/* Vehicle Specifications */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 border-t border-gray-100 pt-4">
                {" "}
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">Vehicle Type</span>
                  <div className="flex items-center mt-1">
                    <Briefcase className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="font-medium capitalize">
                      {post.vehicle_type || "Not specified"}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">Engine</span>
                  <div className="flex items-center mt-1">
                    <Gauge className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="font-medium">
                      {post.engine_capacity
                        ? `${post.engine_capacity}cc`
                        : "Not specified"}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">Transmission</span>
                  <div className="flex items-center mt-1">
                    <RotateCcw className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="font-medium capitalize">
                      {post.transmission || "Not specified"}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">Fuel Type</span>
                  <div className="flex items-center mt-1">
                    <Fuel className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="font-medium capitalize">
                      {post.fuel_type || "Not specified"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 text-sm">
                {" "}
                <div className="flex items-center text-gray-500">
                  <User className="w-4 h-4 mr-2" />
                  <span>
                    Seller: {seller ? seller.full_name : "Loading..."}
                  </span>
                </div>
                <div className="flex items-center text-gray-500">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Posted: {post.postedDate}</span>
                </div>
                {post.location && (
                  <div className="flex items-center text-gray-500">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>Location: {post.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            {post.description && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Description</h2>
                <p className="text-gray-700">{post.description}</p>
              </div>
            )}

            {/* Features */}
            {post.features && post.features.length > 0 && (
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
            )}
            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/posts")}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-md font-medium transition-colors"
              >
                Back to Posts
              </button>
              <button
                onClick={showContactModal}
                className="flex-1 border border-orange-500 text-orange-500 hover:bg-orange-50 py-3 px-4 rounded-md font-medium transition-colors"
              >
                Contact Seller
              </button>
            </div>
          </div>
        </div>
      </motion.div>{" "}
      {/* Contact Seller Modal */}{" "}
      <Modal
        title={`Contact ${seller?.full_name || "Seller"}`}
        visible={contactModalVisible}
        onCancel={hideContactModal}
        footer={null}
        centered
        width={400}
      >
        {!seller?.email && !seller?.phone ? (
          <div className="flex flex-col items-center justify-center py-6">
            <p className="text-gray-600">No Contact Information Available</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {seller?.email && (
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-gray-500 mr-2" />
                <span className="text-gray-700">{seller.email}</span>
              </div>
            )}
            {seller?.phone && (
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-gray-500 mr-2" />
                <span className="text-gray-700">{seller.phone}</span>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
