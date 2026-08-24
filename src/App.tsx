import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import HomeV2 from './pages/HomeV2'
import AddRecord from './pages/AddRecord'
import Search from './pages/Search'
import RecordDetail from './pages/RecordDetail'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home-v2" element={<HomeV2 />} />
      <Route path="/add" element={<AddRecord />} />
      <Route path="/search" element={<Search />} />
      <Route path="/record/:id" element={<RecordDetail />} />
    </Routes>
  )
}
