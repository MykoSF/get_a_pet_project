import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'

// components
import Navbar from './components/layouts/Navbar'
import Footer from './components/layouts/Footer'
import Container from './components/layouts/Container'
import Message from './components/layouts/Message'

// páginas
import Login from './components/pages/Auth/Login'
import Register from './components/pages/Auth/Register'
import Home from './components/pages/Home'
import Profile from './components/pages/User/Profile'
import MyPets from './components/pages/Pets/MyPets'
import AddPet from './components/pages/Pets/AddPet'
import EditPet from './components/pages/Pets/EditPet'
import PetDetails from './components/pages/Pets/PetDetails'
import MyAdoptions from './components/pages/Pets/MyAdoptions'

//context
import { UserProvider } from './context/UserContext'

function App() {
  return (
    <Router>
      <UserProvider>
        <Navbar />
        <Message />
          <Container>
            <Routes>
              <Route path='/login' element={<Login />}/>
              <Route path='/register' element={<Register />}/>
              <Route path='/user/profile' element={<Profile />} />
              <Route path='/pet/mypets' element={<MyPets />} />
              <Route path='/pet/add' element={<AddPet />} />
              <Route path='/pet/edit/:id' element={<EditPet />} />
              <Route path='/pet/myadoptions' element={<MyAdoptions />} />
              <Route path='/pet/:id' element={<PetDetails />} />
              <Route path='/' element={<Home />}/>
            </Routes>
          </Container>
        <Footer />
      </UserProvider>
    </Router>
  );
}

export default App;
