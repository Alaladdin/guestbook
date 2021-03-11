document.addEventListener('DOMContentLoaded', async () => {
  const form = document.querySelector('.form');

  /**
   * Generate human readable date from dateString
   * @param dateString
   * @returns {string}
   */
  const formatDate = (dateString) => {
    const options = {
      hour: '2-digit',
      minute: '2-digit',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour12: false,
    };

    return new Date(dateString).toLocaleString(undefined, options);
  };

  /**
   * Creates comment element on the page from data object
   * @param obj
   */
  const createComment = (obj) => {
    const container = document.querySelector('.comments');
    const card = document.createElement('div');
    const cardHeader = document.createElement('div');
    const cardBody = document.createElement('div');
    const cardFooter = document.createElement('div');
    const createdOn = document.createElement('small');

    card.classList.add('card', 'mb-4', 'bg-dark', 'text-light');
    cardHeader.classList.add('card-header');
    cardBody.classList.add('card-body');
    cardFooter.classList.add('card-footer');
    createdOn.classList.add('text-muted');

    cardHeader.textContent = obj.author;
    cardBody.textContent = obj.comment;
    createdOn.textContent = formatDate(obj.createdOn);

    container.append(card);
    card.append(cardHeader);
    card.append(cardBody);
    card.append(cardFooter);
    cardFooter.append(createdOn);
  };

  /**
   * Gets all comments from server
   * @returns {Promise<* | void>}
   */
  const getComments = async () => {
    return fetch('/comments/')
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw Error(json);
        return json;
      })
      .catch(console.error);
  };

  /**
   * Sending post request to the server to add a comment
   * @param comment
   * @returns {Promise<* | void>}
   */
  const addComment = async (comment) => {
    return fetch('/comments/add/', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ comment }),
    })
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw Error(json);
        return json;
      })
      .catch(console.error);
  };

  /**
   * Gets form data
   * @returns {{comment: (*|this|string), username: (*|this|string)}}
   */
  const getFormData = () => {
    const username = form.querySelector('[name="username"]').value;
    const comment = form.querySelector('[name="comment"]').value;

    return {
      username: username.trim(),
      comment: comment.trim(),
    };
  };

  /**
   * Updates comments count
   * @param value
   */
  const updateCommentsCount = (value = '0') => {
    const commentsCountEl = document.querySelector('.comments__count');

    commentsCountEl.textContent = value;
  };

  /**
   * Listens the form to toggle submit button disabled prop
   */
  const formListener = () => {
    const formName = document.querySelector('.form__input-name');
    const formComment = document.querySelector('.form__input-comment');

    const toggleBtn = () => {
      const formBtn = document.querySelector('.form__submit');
      const formNameLength = formName.value.length;
      const formCommentLength = formComment.value.length;

      formBtn.disabled = !(formNameLength > 0 && formCommentLength > 0);
    };

    formName.addEventListener('input', toggleBtn);
    formComment.addEventListener('input', toggleBtn);
  };

  /**
   * Init functions
   */
  const init = async () => {
    const { commentsList } = await getComments();

    formListener();
    updateCommentsCount(commentsList.length);

    commentsList.forEach((comment) => {
      createComment(comment);
    });
  };

  /**
   * Form submitting event. Sending form data to the server
   */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const commentsCountEl = document.querySelector('.comments__count');
    const commentData = getFormData();
    const { newComment } = await addComment(commentData);

    createComment(newComment);
    updateCommentsCount(parseInt(commentsCountEl.textContent, 10) + 1);

    // scroll to bottom
    window.scrollTo(0, document.body.scrollHeight);

    // reset the form
    form.reset();
  });

  await init();
});
