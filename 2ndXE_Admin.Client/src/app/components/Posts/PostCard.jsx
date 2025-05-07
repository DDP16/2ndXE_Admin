import { motion } from "framer-motion";
import { Edit2, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PostCard({ post, onEdit = "", onDelete = "" }) {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const nav = useNavigate();

  return (
    <motion.div
      variants={itemVariants}
      className="bg-white rounded-xl border border-gray-100 shadow-md hover:shadow-lg hover:scale-102 transition-all duration-100 flex-1 flex-col h-auto"
    >
      {/* Image Section */}
      <div className="relative">
        <div className="relative w-full aspect-square bg-gray-100 flex items-center justify-center overflow-hidden rounded-t-xl">
          <img
            src={post.imageURL[0]}
            alt={post.title}
            className="w-full h-full object-contain "
          />
        </div>
        <span className="absolute bottom-2 right-2 bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
          {post.status}
        </span>
      </div>

      {/* Content Section */}
      <div className="px-4 pt-3 pb-4 flex flex-col space-y-1">
          <h3 className="text-md font-semibold text-gray-800 cursor-pointer" 
            onClick={
              () => nav(`/posts/${post.id}`)
            }
          >
            {post.title}
          </h3>
          <p className="text-sm text-gray-500">
            {post.brand} - {post.year} - {post.mileage}km
          </p>
        <div className="flex items-center justify-between">
          <p className="text-primary font-bold text-lg">${post.price.toFixed(2)}</p>
          <p className="text-sm text-gray-500">28 days left</p>
        </div>

        {/* Buttons */}
        <div className="flex justify-evenly gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onEdit(post.id)}
            className="flex-1 py-2 text-sm font-medium text-white bg-[#2B4985] rounded-md hover:bg-blue-800 active:scale-95 transition-colors duration-200 cursor-pointer"
          >
            <div className="flex items-center justify-center">
              <Edit2 size={16} className="mr-1" />
              Edit
            </div>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onDelete(post.id)}
            className="flex-1 py-2 text-sm font-medium text-white bg-[#F43030] rounded-md hover:bg-red-600 active:scale-95 transition-colors duration-200 cursor-pointer"
          >
            <div className="flex items-center justify-center">
              <Trash2 size={16} className="mr-1" />
              Delete
            </div>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
