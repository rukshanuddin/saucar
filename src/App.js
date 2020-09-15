import React, { useState, useEffect } from "react";
import "./App.css";
import { API } from "aws-amplify";
import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";
import { listPosts } from "./graphql/queries";
import {
  createPost as createPostMutation,
  deletePost as deletePostMutation,
} from "./graphql/mutations";

const initialFormState = { name: "", description: "" };

function App() {
  const [notes, setPosts] = useState([]);
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    const apiData = await API.graphql({ query: listPosts });
    setPosts(apiData.data.listPosts.items);
  }

  async function createPost() {
    if (!formData.name || !formData.description) return;
    await API.graphql({
      query: createPostMutation,
      variables: { input: formData },
    });
    setPosts([...notes, formData]);
    setFormData(initialFormState);
  }

  async function deletePost({ id }) {
    const newPostsArray = notes.filter((post) => post.id !== id);
    setPosts(newPostsArray);
    await API.graphql({
      query: deletePostMutation,
      variables: { input: { id } },
    });
  }

  return (
    <div className="App">
      <h1>My Posts App</h1>
      <input
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Post name"
        value={formData.name}
      />
      <input
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
        placeholder="Post description"
        value={formData.description}
      />
      <button onClick={createPost}>Create Post</button>
      <div style={{ marginBottom: 30 }}>
        {notes.map((post) => (
          <div key={post.id || post.name}>
            <h2>{post.name}</h2>
            <p>{post.description}</p>
            <button onClick={() => deletePost(post)}>Delete post</button>
          </div>
        ))}
      </div>
      <AmplifySignOut />
    </div>
  );
}

export default withAuthenticator(App);
