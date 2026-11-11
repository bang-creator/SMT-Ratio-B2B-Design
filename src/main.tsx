import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './shell/AppShell';
import { Audio, Agents, Decisions, Home, Images, Response, Specimen, Usage } from './screens/Pages';
import './styles/app.css';
function App(){return <Routes><Route element={<AppShell/>}><Route path="/home" element={<Home/>}/><Route path="/response" element={<Response/>}/><Route path="/chat/edit" element={<Response/>}/><Route path="/decisions" element={<Decisions/>}/><Route path="/agents" element={<Agents/>}/><Route path="/audio" element={<Audio/>}/><Route path="/audio/realtime/edit" element={<Audio/>}/><Route path="/images" element={<Images/>}/><Route path="/playground/images" element={<Images/>}/><Route path="/usage" element={<Usage/>}/><Route path="/specimen" element={<Specimen/>}/><Route path="*" element={<Navigate to="/home" replace/>}/></Route></Routes>}
createRoot(document.getElementById('root')!).render(<React.StrictMode><BrowserRouter><App/></BrowserRouter></React.StrictMode>);
