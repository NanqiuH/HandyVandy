import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Home';
import SignUpPage from './components/SignUpPage/SignUpPage';
import LoginPage from './components/LoginPage/LoginPage';
import CreateProfilePage from './components/CreateProfilePage/CreateProfilePage';
import ProfileListPage from './components/ProfileListPage/ProfileListPage';
import ProfileViewPage from './components/ProfileViewPage/ProfileViewPage';
import ChatPage from './components/ChatPage/ChatPage'; 
import ReviewPage from './components/ReviewPage/ReviewPage';
import CreatePostingPage from './components/CreatePostingPage/CreatePostingPage';
import ViewPostingsPage from './components/ViewPostingsPage/ViewPostingsPage';
import SinglePostViewPage from './components/SinglePostViewPage/SinglePostViewPage';
import SearchPostingsPage from './components/SearchPostingsPage/SearchPostingsPage';
import CategoryPage from './components/CategoryPage/CategoryPage';
import SearchPostNearby from './maps/SearchPostNearby';

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
        <Route path="/chat/:id" element={<ChatPage />} />
        <Route path="/review/:id" element={<ReviewPage />} />
        <Route path='/create-posting' element={<CreatePostingPage />} />
        <Route path='/posting-list' element={<ViewPostingsPage />} />
        <Route path="/posting/:id" element={<SinglePostViewPage />} />
        {/* <Route path='/search-posting' element={<SearchPostingsPage />} /> */}
        <Route path='/category' element={<CategoryPage />} />
        <Route path='/search-post-nearby' element={<SearchPostNearby />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;