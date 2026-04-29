import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import theme from './theme';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Gallery from './pages/Gallery';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Registry from './pages/Registry';
import AiAssistant from './components/AiAssistant';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <Box component="main" sx={{ flexGrow: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/registry" element={<Registry />} />
            </Routes>
          </Box>
          <Footer />
        </Box>
      </Router>
      <AiAssistant />
    </ThemeProvider>
  );
}
export default App;
