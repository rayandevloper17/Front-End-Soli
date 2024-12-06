import React from 'react';
import './CSs/Setting.css';
import { FaBuilding, FaMapMarkerAlt, FaMoneyBillWave, FaIdBadge, FaPhone, FaEnvelope, FaGlobe, FaFileInvoice, FaImage } from 'react-icons/fa';

const Settings = () => {
  return (
    <div className='setting'>
      <div className='main_content'>
        <h1>Paramètres de l'entreprise</h1>

        <form className='settings-form'>
          {/* Grouping fields horizontally */}
          <div className='form-row'>
            <div className='form-group'>
              <label htmlFor='Nomdelentreprise'>
                <FaBuilding className='icon' /> Nom de l'entreprise:
              </label>
              <input type='text' id='Nomdelentreprise' placeholder="Entrez le nom de l'entreprise" />
            </div>

            <div className='form-group'>
              <label htmlFor='adressedlaociete'>
                <FaMapMarkerAlt className='icon' /> Adresse de la société:
              </label>
              <input type='text' id='adressedlaociete' placeholder="Entrez l'adresse de la société" />
            </div>
          </div>

          <div className='form-row'>
            <div className='form-group'>
              <label htmlFor='Capitalsocial'>
                <FaMoneyBillWave className='icon' /> Capital social:
              </label>
              <input type='text' id='Capitalsocial' placeholder='Entrez le capital social' />
            </div>

            <div className='form-group'>
              <label htmlFor='NIF'>
                <FaIdBadge className='icon' /> NIF:
              </label>
              <input type='text' id='NIF' placeholder='Entrez le NIF' />
            </div>
          </div>

          <div className='form-row'>
            <div className='form-group'>
              <label htmlFor='FAX'>
                <FaPhone className='icon' /> FAX:
              </label>
              <input type='text' id='FAX' placeholder='Entrez le FAX' />
            </div>

            <div className='form-group'>
              <label htmlFor='NtElephone'>
                <FaPhone className='icon' /> N° de téléphone:
              </label>
              <input type='text' id='NtElephone' placeholder='Entrez le N° de téléphone' />
            </div>
          </div>

          <div className='form-row'>
            <div className='form-group'>
              <label htmlFor='Emaildeentreprise'>
                <FaEnvelope className='icon' /> Email de l'entreprise:
              </label>
              <input type='email' id='Emaildeentreprise' placeholder="Entrez l'email de l'entreprise" />
            </div>

            <div className='form-group'>
              <label htmlFor='SiteWebdentreprise'>
                <FaGlobe className='icon' /> Site Web de l'entreprise:
              </label>
              <input type='url' id='SiteWebdentreprise' placeholder="Entrez le site web de l'entreprise" />
            </div>
          </div>

          <div className='form-row'>
            <div className='form-group'>
              <label htmlFor='tembre'>
                <FaFileInvoice className='icon' /> Timbre:
              </label>
              <input type='text' id='tembre' placeholder='Entrez le timbre' />
            </div>

            <div className='form-group'>
              <label htmlFor='photoCompany'>
                <FaImage className='icon' /> Photo de l'entreprise:
              </label>
              <input type='text' id='photoCompany' placeholder="Entrez l'URL de la photo de l'entreprise" />
            </div>
          </div>

          {/* Submit Button */}
          <button type='submit' className='submit-btn'>Enregistrer les paramètres</button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
