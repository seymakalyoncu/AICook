import React from "react";
import { useForm } from "react-hook-form";

const ArticleForm = ({ onSubmit, defaultValues }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block">Title</label>
        <input
          {...register("title", { required: "Title is required" })}
          className="border p-2 w-full rounded"
        />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block">Content</label>
        <textarea
          {...register("content", { required: "Content is required" })}
          className="border p-2 w-full rounded"
        />
        {errors.content && <p className="text-red-500">{errors.content.message}</p>}
      </div>

      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        {defaultValues ? "Update" : "Create"}
      </button>
    </form>
  );
};

export default ArticleForm;