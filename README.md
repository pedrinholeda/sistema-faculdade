# Facultech

## Prototipo de sistema de faculdade

### Funções presentes no Prototipo:

- Cadastrar Usuario(normal user, Admin).
- Login para diferenciar Usuario de Administrador.
- Se pode criar, editar e deletar Cursos.
- Se pode criar, editar e deletar Materias criadas dentro dos Cursos.
- Listagem de cursoss e listagem de materias.

## Packages de Dependencias Usadas :

```

    "bcryptjs": "^2.4.3",
    "body-parser": "^1.19.0",
    "connect-flash": "^0.1.1",
    "express": "^4.17.1",
    "express-handlebars": "^3.1.0",
    "express-session": "^1.16.2",
    "mongoose": "^5.6.11",
    "nodemon": "^1.19.1",
    "passport": "^0.4.0",
    "passport-local": "^1.0.0"

```

## Como criar um usuario com privilegios de Administrador:

- Entre no arquivo "usuarios.js" dentro da pasta de rotas "routes".
- Procure a constante novoUsuario.

```
 const novoUsuario = new Usuario({
      nome: req.body.nome,
      email: req.body.email,
      senha: req.body.senha
          });
```

- Apos encontrar, altere a constante adicionando o eAdmin e atribua a ele o valor 1 :

```
 const novoUsuario = new Usuario({
      nome: req.body.nome,
      email: req.body.email,
      senha: req.body.senha,
      eAdmin: 1
          });
```

- Feito isso salve o codigo, suba o servidor e cadastre o usuario, cadastrado o usuario no banco de dados ele vira com privilegios de administrador, após cadastrar retorne a constante novoUsuario para forma antiga (sem o eAdmin) e suba o servidor novamente.

- Apos criar um usuario com privilegios de administrador, a opção de gerenciar sera liberada na NavBar, lá e possivel criar um novo usuario administrador por meio do front-end.
