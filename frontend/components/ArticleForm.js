import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const initialFormValues = { title: '', text: '', topic: '' };

export default function ArticleForm({
  postArticle,
  updateArticle,
  setCurrentArticleId,
  currentArticle,
}) {
  const [values, setValues] = useState(initialFormValues);
  const [successMessage, setSuccessMessage] = useState('');
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    if (currentArticle) {
      setValues({
        title: currentArticle.title || '',
        text: currentArticle.text || '',
        topic: currentArticle.topic || '',
      });
    } else {
      setValues(initialFormValues);
    }
  }, [currentArticle]);

  const onChange = (evt) => {
    const { id, value } = evt.target;
    setValues({ ...values, [id]: value });
  };

  const onSubmit = async (evt) => {
    evt.preventDefault();
    try {
      if (currentArticle) {
        // Existing article - perform update
        await updateArticle({ article_id: currentArticle.article_id, article: values });
        // Handle update logic, if needed
      } else {
        // New article - perform creation
        const newArticle = await postArticle(values);
        // Update the articles state with the newly created article
        setArticles([...articles, newArticle]);
      }

      // Reset form after successful submission
      setValues(initialFormValues);
      // Clear currentArticle ID after submission
      setCurrentArticleId(null);
      // Display success message
      setSuccessMessage('Article posted successfully');
    } catch (error) {
      console.error('Error while posting/updating article:', error);
      // Handle error
    }
  };
  
  const isDisabled = () => {
    return !(values.title.trim().length > 0 && values.text.trim().length > 0 && values.topic.trim().length > 0);
  };

  return (
    <form id="form" onSubmit={onSubmit}>
      {successMessage && <div>{successMessage}</div>}
      <h2>{currentArticle ? 'Edit' : 'Create'}</h2>
      <input
        maxLength={50}
        onChange={onChange}
        value={values.title}
        placeholder="Enter title"
        id="title"
      />
      <textarea
        maxLength={200}
        onChange={onChange}
        value={values.text}
        placeholder="Enter text"
        id="text"
      ></textarea>
      <select onChange={onChange} id="topic" value={values.topic}>
        <option value="">-- Select topic --</option>
        <option value="JavaScript">JavaScript</option>
        <option value="React">React</option>
        <option value="Node">Node</option>
      </select>
      <div className="button-group">
        <button disabled={isDisabled()} id="submitArticle">
          {currentArticle ? 'Edit' : 'Submit'}
        </button>
        {currentArticle && (
          <button onClick={() => setCurrentArticleId(null)}>Cancel edit</button>
        )}
      </div>
    </form>
  );
}


ArticleForm.propTypes = {
  postArticle: PropTypes.func.isRequired,
  updateArticle: PropTypes.func.isRequired,
  setCurrentArticleId: PropTypes.func.isRequired,
  currentArticle: PropTypes.shape({
    article_id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    topic: PropTypes.string.isRequired,
  }),
};
