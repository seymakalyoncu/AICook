// src/pages/ArticlesPage.jsx
import React, { useEffect, useState } from "react";
import {
  getArticles,
  createArticle,
  deleteArticle,
  updateArticle,
} from "../../services/articles";
import ArticleForm from "../../components/Articles/ArticleForm";
import toast, { Toaster } from "react-hot-toast";

const ArticlesPage = () => {
  const [articles, setArticles] = useState([]);
  const [editingArticle, setEditingArticle] = useState(null);

  const fetchArticles = async () => {
    const res = await getArticles();
    setArticles(res.data);
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleSubmit = async (data) => {
    try {
      if (editingArticle) {
        await updateArticle(editingArticle.id, data);
        toast.success("Article updated");
      } else {
        await createArticle(data);
        toast.success("Article created");
      }
      fetchArticles();
      setEditingArticle(null);
    } catch {
      toast.error("Error saving article");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteArticle(id);
      toast.success("Article deleted");
      fetchArticles();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Toaster />
      <h1 className="text-2xl font-bold mb-4">Articles</h1>
      <ArticleForm onSubmit={handleSubmit} defaultValues={editingArticle} />

      <ul className="mt-6 space-y-4">
        {articles.map((article) => (
          <li key={article.id} className="border p-4 rounded shadow">
            <h2 className="font-bold text-lg">{article.title}</h2>
            <p>{article.content}</p>
            <div className="mt-2 space-x-2">
              <button
                onClick={() => setEditingArticle(article)}
                className="text-blue-500"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(article.id)}
                className="text-red-500"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ArticlesPage;