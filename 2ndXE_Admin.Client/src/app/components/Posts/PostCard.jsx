import { motion } from "framer-motion";
import { Edit2, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Popconfirm,
  Spin,
} from "antd";
import { useState } from "react";

const { TextArea } = Input;

export default function PostCard({ post, onEdit = "", onDelete = "" }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const nav = useNavigate();

  const handleEditClick = () => {
    setIsEditModalVisible(true);
    form.setFieldsValue({
      title: post.title,
      description: post.description,
      brand: post.brand,
      model: post.model,
      year: post.year,
      mileage: post.mileage,
      price: post.price,
      location: post.location,
      status: post.status,
    });
  };

  const handleEditSubmit = async (values) => {
    console.log("Edit form values:", values);
    setIsLoading(true);
    try {
      if (onEdit && typeof onEdit === "function") {
        await onEdit(post.id, values);
      }
      setIsEditModalVisible(false);
    } catch (error) {
      console.error("Error updating post:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setIsLoading(true);
    try {
      if (onDelete && typeof onDelete === "function") {
        await onDelete(post.id);
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-xl border border-gray-100 shadow-md hover:shadow-lg hover:scale-102 transition-all duration-100 flex-1 flex-col h-auto relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-80 rounded-xl flex items-center justify-center z-20">
            <Spin size="large" />
          </div>
        )}
        {/* Floating Action Buttons */}
        {isHovered && (
          <div className="absolute top-2 right-2 z-10 flex gap-1">
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleEditClick}
              className="w-8 h-8 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors duration-200"
            >
              <Edit2 size={14} />
            </motion.button>
            <Popconfirm
              title="Delete Post"
              description="Are you sure you want to delete this post?"
              onConfirm={handleDeleteConfirm}
              okText="Yes"
              cancelText="No"
              okType="danger"
              placement="left"
            >
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors duration-200"
              >
                <Trash2 size={14} />
              </motion.button>
            </Popconfirm>
          </div>
        )}
        {/* Image Section */}
        <div className="relative">
          <div className="relative w-full aspect-[6/5] bg-gray-100 flex items-center justify-center overflow-hidden rounded-t-xl">
            {post.imageURL && post.imageURL.length > 0 ? (
              <img
                src={post.imageURL[0]}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-gray-200">
                <p className="text-gray-500 font-medium text-xl">No Image</p>
              </div>
            )}
          </div>
          <span className="absolute bottom-2 right-2 bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
            {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
          </span>
        </div>
        {/* Content Section */}
        <div className="px-4 pt-3 pb-4 flex flex-col space-y-1">
          <h3
            className="text-md font-semibold text-gray-800 cursor-pointer"
            onClick={() => nav(`/posts/${post.id}`)}
          >
            {post.title}
          </h3>
          <p className="text-sm text-gray-500">
            {post.brand} - {post.year} - {post.mileage}km
          </p>{" "}
          <div className="flex items-center justify-between">
            <p className="text-primary font-bold text-lg">
              ${post.price.toFixed(2)}
            </p>
            <p
              className={`text-sm text-gray-500 ${
                post.expire_at ? "" : "text-red-500 font-semibold"
              }`}
            >
              {post.expire_at
                ? Math.ceil(
                    (new Date(post.expire_at) - new Date()) /
                      (1000 * 60 * 60 * 24)
                  )
                : 0}{" "}
              days left
            </p>
          </div>
        </div>
      </motion.div>

      {/* Edit Modal */}
      <Modal
        title="Edit Post"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
        width={800}
      >
        <div className="flex gap-4">
          <div className="w-1/3">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Images</h4>
              <div className="grid grid-cols-2 gap-2">
                {post.imageURL && post.imageURL.length > 0 ? (
                  post.imageURL.map((url, index) => (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden border">
                      <img
                        src={url}
                        alt={`${post.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400 text-sm">No images</span>
                  </div>
                )}
              </div>
          </div>

          {/* Right side - Form */}
          <div className="flex-1">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleEditSubmit}
            >
              <Form.Item
                label="Title"
                name="title"
                rules={[{ required: true, message: "Please enter the title" }]}
                style={{ marginBottom: '12px' }}
              >
                <Input placeholder="Post title" />
              </Form.Item>

              <Form.Item
                label="Description"
                name="description"
                style={{ marginBottom: '12px' }}
              >
                <TextArea rows={3} placeholder="Post description" />
              </Form.Item>

              <div className="grid grid-cols-2 gap-3">
                <Form.Item
                  label="Brand"
                  name="brand"
                  rules={[{ required: true, message: "Please enter the brand" }]}
                  style={{ marginBottom: '12px' }}
                >
                  <Input placeholder="Brand" />
                </Form.Item>

                <Form.Item
                  label="Model"
                  name="model"
                  style={{ marginBottom: '12px' }}
                >
                  <Input placeholder="Model" />
                </Form.Item>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <Form.Item
                  label="Year"
                  name="year"
                  rules={[{ required: true, message: "Please enter the year" }]}
                  style={{ marginBottom: '12px' }}
                >
                  <InputNumber
                    placeholder="Year"
                    min={1900}
                    max={new Date().getFullYear() + 1}
                    style={{ width: '100%' }}
                  />
                </Form.Item>

                <Form.Item
                  label="Mileage"
                  name="mileage"
                  rules={[{ required: true, message: "Please enter the mileage" }]}
                  style={{ marginBottom: '12px' }}
                >
                  <InputNumber
                    placeholder="km"
                    min={0}
                    style={{ width: '100%' }}
                  />
                </Form.Item>

                <Form.Item
                  label="Price"
                  name="price"
                  rules={[{ required: true, message: "Please enter the price" }]}
                  style={{ marginBottom: '12px' }}
                >
                  <InputNumber
                    placeholder="USD"
                    min={0}
                    step={0.01}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Form.Item
                  label="Location"
                  name="location"
                  style={{ marginBottom: '12px' }}
                >
                  <Input placeholder="Location" />
                </Form.Item>

                <Form.Item
                  label="Status"
                  name="status"
                  rules={[{ required: true, message: "Required!" }]}
                  style={{ marginBottom: '12px' }}
                >
                  <Select placeholder="Status">
                    <Select.Option value="available">Available</Select.Option>
                    <Select.Option value="pending">Pending</Select.Option>
                    <Select.Option value="sold">Sold</Select.Option>
                    <Select.Option value="expired">Expired</Select.Option>
                  </Select>
                </Form.Item>
              </div>

              <div className="flex justify-end gap-2 mt-2">
                <Button
                  onClick={() => setIsEditModalVisible(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit" loading={isLoading}>
                  Submit
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </Modal>
    </>
  );
}
