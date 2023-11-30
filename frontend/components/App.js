import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import axios from 'axios'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate();

  const redirectToLogin = () => {
    navigate('/');
  };

  const redirectToArticles = () => {
    navigate('/articles');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setMessage('Goodbye!');
    redirectToLogin('/');
  };

  const login = async ({ username, password }) => {
    console.log(login)
    setMessage('');
    setSpinnerOn(false); // Set spinner on during login request
  
    try {
      const response = await axios.post(loginUrl, { username, password }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.status === 200) {
        const data = response.data;
        localStorage.setItem('token', data.token); // Save token to local storage
        setMessage(data.message);
        redirectToArticles(); // Redirect to Articles screen
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('An error occurred during login');
    } finally {
      setSpinnerOn(false); // Turn off spinner
    }
  };
  

  const getArticles = async () => {
    setMessage('');
    setSpinnerOn(false); // Set spinner on while fetching articles
  
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        redirectToLogin();
        return;
      }
  
      const response = await axios.get(articlesUrl, {
        headers: {
          Authorization: token, // Use Bearer token format
        },
      });
  
      const data = response.data;
      console.log('getArticles', data.message);
      setArticles(data.articles);
      setMessage(data.message); // Assuming username is available in the response
  
    } catch (error) {
      setMessage('An error occurred while fetching articles');
    } finally {
      setSpinnerOn(false); // Turn off spinner
    }
  };

  const postArticle = async (articleData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        redirectToLogin();
        return;
      }
  
      const postUrl = 'http://localhost:9000/api/articles'; // URL to create a new article
  
      const response = await fetch(postUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify(articleData),
      });
  
      if (response.ok) {
        const newArticle = await response.json();
  
        // Update the articles state to include the newly created article
        setArticles([...articles, newArticle]);
  
        setMessage('Article posted successfully!');
        return newArticle; // Return the newly created article if needed
      } else if (response.status === 401) {
        redirectToLogin(); // Redirect to login if token is invalid
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || 'Failed to post article');
      }
    } catch (error) {
      setMessage('An error occurred while posting the article');
    }
  };
  
  

  const updateArticle = async ({ article_id, article }) => {
    setMessage('');
    setSpinnerOn(true); // Set spinner on while updating article
  
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        redirectToLogin();
        return;
      }
  
      const updateUrl = `http://localhost:9000/api/articles/${article_id}`;
  
      // Implement AJAX call to update article using Axios
      const response = await axios.put(updateUrl, article, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });
  
      const data = response.data;
      setArticles(data.articles);
      setMessage(data.message);
    } catch (error) {
      setMessage('An error occurred while updating the article');
    } finally {
      setSpinnerOn(false); // Turn off spinner
    }
  };


  
  const deleteArticle = async (article_id) => {
    setMessage('');
    setSpinnerOn(true); // Set spinner on while deleting article
  
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        redirectToLogin();
        return;
      }
  
      const deleteUrl = `http://localhost:9000/api/articles/${article_id}`;
  
      // Implement AJAX call to delete article
      const response = await fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
          Authorization: token,
        },
      });
  
      if (response.ok) {
        // Remove the deleted article from the UI
        setArticles(articles.filter(article => article.article_id !== article_id));
  
        const data = await response.json();
        // Handle the response, e.g., update UI or show success message
        setMessage(data.message || 'Article deleted successfully!');
        // Perform additional actions if needed
      } else if (response.status === 401) {
        redirectToLogin(); // Redirect to login if token is invalid
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || 'Failed to delete article');
        // Handle other error cases
      }
    } catch (error) {
      setMessage('An error occurred while deleting the article');
    } finally {
      setSpinnerOn(false); // Turn off spinner
    }
  };
  
  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn}/>
      <Message message={message} />
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login}/>} />
          <Route path="articles" element={
            <>
              <ArticleForm
              postArticle={postArticle}
              updateArticle={updateArticle}
              setCurrentArticleId={setCurrentArticleId}
              currentArticleId={currentArticleId}
              setArticles={setArticles} />
              <Articles
              articles={articles}
              getArticles={getArticles}
              deleteArticle={deleteArticle}
              setCurrentArticleId={setCurrentArticleId}
              currentArticleId={currentArticleId} />
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  )
}
