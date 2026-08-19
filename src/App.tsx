import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import AddRecord from './pages/AddRecord'
import Search from './pages/Search'
import RecordDetail from './pages/RecordDetail'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/add" element={<AddRecord />} />
      <Route path="/search" element={<Search />} />
      <Route path="/record/:id" element={<RecordDetail />} />
    </Routes>
  )
}
