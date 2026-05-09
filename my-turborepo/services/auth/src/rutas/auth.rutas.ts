import { Router } from 'express';
import { registrar, login, logout } from '../controladores/auth.controlador';
import { autenticar } from '../middlewares/autenticar';


const enrutador:Router = Router();

enrutador.post('/registrar', registrar);
enrutador.post('/iniciar-sesion', login);
enrutador.post('/cerrar-sesion', autenticar, logout);

export default enrutador;