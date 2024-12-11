import React, { useState ,useRef,useEffect} from 'react';
import axios from 'axios';
import './CSs/AddUser.css';

// Define the Snackbar component
const Snackbar = ({ message, isError, isOpen, onClose }) => {
  if (!isOpen) return null; // Don't render if not open

  return (
    <div className={`snackbar ${isError ? 'error' : 'success'}`} onClick={onClose}>
      {message}
    </div>
  );
};

const AddUser = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    Relasion: '',
    RaisonSocial: '',
    RaisonSocialAr: '',
    Region: '',
    CadeBarre: '',
    FullName: '',
    NomeAr: '',
    Matricule: '',
    Prenome: '',
    Prenomear: '',
    selected_option: '',
    selected_checkbox_str: '',
    Adress: '',
    Activite: '',
    MaxCredit: '',
    Mantennte: '',
    Tel: '',
    Mobile: '',
    Telfix: '',
    Email: '',
    Reseouxsociaux: '',
    SiteWeb: '',
    Nis: '',
    Nif: '',
    Banque: '',
    Rc: '',
    Numdarticle: '',
    Numedecompte: '',
    Categorie: '',
    Fonction: '',
    Datederecrutement: '',
    Salair: '',
    Etablissment: '',
    DateFinFoncotion: '',
    selected_checkbox_str2: '',
    Observation: '',
    Delaisderetour: '',
    Delaiscreance: '',
    Delaisecheance: '',
    DataNissance: '',
    TextLabel: '',
    TexIndNationalLabel: '',
    Numdeper: '',
    IciNomemer: '',
  });

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    message: '',
    isError: false,
    isOpen: false,
  });
  const inputRef = useRef(null);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus(); // Focus on the input when the component loads
    }
  }, []); // Empty dependency array ensures this runs only once

  const Snackbar = ({ message, isError, isWarning, isOpen }) => {
    if (!isOpen) return null;
  
    // Determine the background color based on the type
    const backgroundColor = isError 
      ? '#f44336' // red for errors
      : isWarning 
      ? '#FFC107' // yellow for warnings
      : '#4CAF50'; // green for success
  
    return (
      <div style={{
        backgroundColor,
        color: '#fff',
        padding: '16px',
        borderRadius: '4px',
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 1000,
        fontSize: '16px',
      }}>
        {message}
      </div>
    );
  };

  const handleKeyDown = (e) => {
    const formElements = Array.from(document.querySelectorAll('input, select, textarea'));
    const currentIndex = formElements.indexOf(e.target);

    if (e.key === 'ArrowDown' || e.key === 'Enter') {
      e.preventDefault();
      const nextElement = formElements[currentIndex + 1];
      if (nextElement) nextElement.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevElement = formElements[currentIndex - 1];
      if (prevElement) prevElement.focus();
    }
  };
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleNext = () => {
    setStep(step + 1);
  };

  const handlePrev = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
  
    // Check if FullName is filled out
    if (!formData.FullName.trim()) {
      setSnackbar({ 
        message: 'Nome Et Prenome is required.', 
        isError: true, 
        isWarning: true,
        isOpen: true 
      });
  
      // Hide Snackbar after 3 seconds
      setTimeout(() => {
        setSnackbar((prev) => ({ ...prev, isOpen: false }));
      }, 3000);
  
      return; // Stop form submission if FullName is empty
    }
  
    try {
      const response = await axios.post('https://www.k-orissa.com:5000/api/suppliers', formData);
      console.log('Supplier added successfully:', response.data);
      setSnackbar({ 
        message: 'User added successfully!', 
        isError: false, 
        isOpen: true 
      });
  
      // Reset the form data
      setFormData({
        Relasion: '',
        RaisonSocial: '',
        RaisonSocialAr: '',
        Region: '',
        CadeBarre: '',
        FullName: '',
        NomeAr: '',
        Matricule: '',
        Prenome: '',
        Prenomear: '',
        selected_option: '',
        selected_checkbox_str: '',
        Adress: '',
        Activite: '',
        MaxCredit: '',
        Mantennte: '',
        Tel: '',
        Mobile: '',
        Telfix: '',
        Email: '',
        Reseouxsociaux: '',
        SiteWeb: '',
        Nis: '',
        Nif: '',
        Banque: '',
        Rc: '',
        Numdarticle: '',
        Numedecompte: '',
        Categorie: '',
        Fonction: '',
        Datederecrutement: '',
        Salair: '',
        Etablissment: '',
        DateFinFoncotion: '',
        selected_checkbox_str2: '',
        Observation: '',
        Delaisderetour: '',
        Delaiscreance: '',
        Delaisecheance: '',
        DataNissance: '',
        TextLabel: '',
        TexIndNationalLabel: '',
        Numdeper: '',
        IciNomemer: '',
      });
  
      // Hide Snackbar after 3 seconds
      setTimeout(() => {
        setSnackbar((prev) => ({ ...prev, isOpen: false }));
      }, 3000);
    } catch (error) {
      console.error('Error adding supplier:', error);
      setSnackbar({ 
        message: 'Error adding user. Please try again.', 
        isError: true, 
        isOpen: true 
      });
  
      // Hide Snackbar after 3 seconds
      setTimeout(() => {
        setSnackbar((prev) => ({ ...prev, isOpen: false }));
      }, 3000);
    }
  };
  

  return (
    <div className='add-user'>
      <Snackbar
        message={snackbar.message}
        isError={snackbar.isError}
        isOpen={snackbar.isOpen}
        onClose={() => setSnackbar((prev) => ({ ...prev, isOpen: false }))}
      />
      <h1>Ajouter un Utilisateur</h1>
      <form onSubmit={handleSubmit} className='form'>
        {step === 1 && (
          <div className='form-section'>
            <h2>Informations de Base</h2>
            <div className='form-group'>
            <div className='form-group'>
              <label htmlFor='RaisonSocial'>Raison Sociale:</label>
              <input
               ref={inputRef}
                type='text'
                id='RaisonSocial'
                value={formData.RaisonSocial}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                required
              />
            </div>

            <div className='form-group'>
              <label htmlFor='FullName'>prenome:</label>
              <input
                type='text'
                id='FullName'
                value={formData.FullName}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                required
              />
            </div>
            <div className='form-group'>
              <label htmlFor='Prenome'>Nome:</label>
              <input
                type='text'
                id='Prenome'
                value={formData.Prenome}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
            </div>
            
             
            </div>
         
            <div className='form-group'>
              <label htmlFor='RaisonSocialAr'>Raison Sociale (Ar):</label>
              <input
                type='text'
                id='RaisonSocialAr'
                value={formData.RaisonSocialAr}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
            </div>

            <div className='form-group'>
              <label htmlFor='Prenomear'>Prénom (Ar):</label>
              <input
                type='text'
                id='Prenomear'
                value={formData.Prenomear}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
            </div>

            <div className='form-group'>
              <label htmlFor='NomeAr'>Nom (Ar):</label>
              <input
                type='text'
                id='NomeAr'
                value={formData.NomeAr}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
            </div>


            
          </div>
        )}

        {step === 2 && (
          <div className='form-section'>
            <h2>Détails de l'Utilisateur</h2>
        
           
            <div className='form-group'>
              <label htmlFor='Matricule'>Matricule:</label>
              <input
                type='text'
                id='Matricule'
                value={formData.Matricule}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                required
              />
            </div>
            <div className='form-group'>
              <label htmlFor='Region'>Région:</label>
              <input
                type='text'
                id='Region'
                value={formData.Region}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                required
              />
            </div>
            <div className='form-group'>
              <label htmlFor='CadeBarre'>Numberre:</label>
              <input
                type='text'
                id='CadeBarre'
                value={formData.CadeBarre}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
            </div>
            <label htmlFor='Relasion'>Relation:</label>
              <input
                type='text'
                id='Relasion'
                value={formData.Relasion}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                required
              />
       
          </div>
        )}

        {step === 3 && (
          <div className='form-section'>
            <h2>Coordonnées</h2>
            <div className='form-group'>
              <label htmlFor='Tel'>Téléphone:</label>
              <input
                type='text'
                id='Tel'
                value={formData.Tel}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                
              />
            </div>
            <div className='form-group'>
              <label htmlFor='Mobile'>Mobile:</label>
              <input
                type='text'
                id='Mobile'
                value={formData.Mobile}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
            </div>
            <div className='form-group'>
              <label htmlFor='Telfix'>Téléphone Fixe:</label>
              <input
                type='text'
                id='Telfix'
                value={formData.Telfix}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
            </div>
            <div className='form-group'>
              <label htmlFor='Email'>Email:</label>
              <input
                type='email'
                id='Email'
                value={formData.Email}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                
              />
            </div>
          </div>
        )}

        <div className='form-navigation'>
          {step > 1 && (
            <button type='button' className='btn-standard prev-btn' onClick={handlePrev}>
              Précédent
            </button>
          )}
          {step < 3 ? (
            <button type='button' className='btn-standard next-btn' onClick={handleNext}>
              Suivant
            </button>
          ) : (
            <button type='button' className='btn-standard next-btn' onClick={handleSubmit}>
              Soumettre
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddUser;
