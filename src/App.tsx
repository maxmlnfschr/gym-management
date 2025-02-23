import "@/App.css";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import { theme } from "@/theme";
import AppRoutes from "@/routes";
import { AuthProvider } from "@/features/auth/components/AuthProvider";
import { Routes, Route } from 'react-router-dom';
import { MembersPage } from '@/features/members/pages/MembersPage';
import { AddMemberPage } from '@/features/members/pages/AddMemberPage';
import { EditMemberPage } from '@/features/members/pages/EditMemberPage';

function App() {
  return (
    <Routes>
      <Route path="/members" element={<MembersPage />} />
      <Route path="/members/add" element={<AddMemberPage />} />
      <Route path="/members/edit/:id" element={<EditMemberPage />} />
      {/* ... otras rutas ... */}
    </Routes>
  );
}

export default App;
