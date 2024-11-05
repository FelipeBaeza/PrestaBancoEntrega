import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import SimulationCredit from './components/SimulationCredit';
import Register from './components/Register';
import SelectType from './components/SelectLoanType';
import RequestFirstHome from './components/RequestFirstHome';
import RequestSecondHome from './components/RequestSecondHome';
import RequestCommercialProperty from './components/RequestCommercialProperty';
import RequestRemodeling from './components/RequestRemodeling';
import StatusRequest from './components/StatusRequest';
import ListRequests from './components/ListRequests';
import EvaluationRequest from './components/EvaluationRequest';



function App() {
  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/simulation" element={<SimulationCredit />} />
          <Route path="/register" element={<Register />} />
          <Route path="/selectType" element={<SelectType />} />
          <Route path="/requestFirstHome/:loanType" element={<RequestFirstHome />} />
          <Route path="/requestSecondHome/:loanType" element={<RequestSecondHome />} />
          <Route path="/requestCommercialProperty/:loanType" element={<RequestCommercialProperty />} />
          <Route path="/requestRemodeling/:loanType" element={<RequestRemodeling />} />
          <Route path="/statusRequest" element={<StatusRequest />} />
          <Route path="/requests" element={<ListRequests />} />
          <Route path="/evaluationRequest/:applicationId/:typeLoan"element={<EvaluationRequest />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
