import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Home';
import SignUpPage from './components/SignUpPage/SignUpPage';
import LoginPage from './components/LoginPage/LoginPage';
import CreateProfilePage from './components/CreateProfilePage/CreateProfilePage';
import ProfileListPage from './components/ProfileListPage/ProfileListPage';
import ProfileViewPage from './components/ProfileViewPage/ProfileViewPage';
import PostPage from './components/CreatePostPage/PostPage';
import CreatePostingPage from './components/CreatePostingPage/CreatePostingPage';
import SearchPostingsPage from './components/SearchPostingsPage/SearchPostingsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/signup' element={<SignUpPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/create-profile' element={<CreateProfilePage />} />
        <Route path='/profile-list' element={<ProfileListPage />} />
        <Route path="/profile/:id" element={<ProfileViewPage />} />
        <Route path="/posts" element={<PostPage />} />
        <Route path='/create-posting' element={<CreatePostingPage />} />
        <Route path='/search-posting' element={<SearchPostingsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;