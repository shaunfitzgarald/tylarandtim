import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import theme from './theme';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Gallery from './pages/Gallery';
import AiAssistant from './components/AiAssistant';

import Navbar from './components/Navbar';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Router>
      <AiAssistant />
    </ThemeProvider>
  );
}

export default App;
