const connection = require("./mysqlconnection.js");
const { sendEmail } = require("./nodemailer.js");
const { v4: uuidv4 } = require('uuid');
const md5 = require('md5');
const jwt = require('jsonwebtoken');

function verifyAuthCredentials(username, password) {
    return new Promise ((resolve, reject) => {
        const sql = "select * from systemuser where email = '" + username + "'";
        executeCustomQuery(sql).then( (res) => {
            if(res.length > 0 ) {
                if(res[0].password == md5(password)) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            } else {
                resolve(false);
            }
        })
    })
}
function verifyToken(req, res, next) {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid token.' });
      }
      req.user = decoded;
      next();
    });
  }
function registerUser(bodyParam) {
    return new Promise ((resolve, reject) => {
      const returnObj = {};
      returnObj.success = true;
      returnObj.message = '';
      let verifyExistingEmailSQL = "SELECT * FROM systemuser where email = '" + bodyParam.email + "'";
      executeCustomQuery(verifyExistingEmailSQL).then( (res) => {
        try{
          if (res.length == 0) {
            if(bodyParam.password == bodyParam.confirmPassword) {
              const uuid = uuidv4();
              let sql = "INSERT INTO systemuser (systemuserid, firstname, lastname, email, password, isVerified) VALUES  ('" + uuid + "','" + bodyParam.firstName + "','" +  bodyParam.lastName + "','" +  bodyParam.email + "','" +  md5(bodyParam.password) + "','0" + "')";
              console.log(sql);
              executeCustomQuery(sql).then( (res) => {
                const confirmEmailObj = {
                  userId : uuid,
                  email : bodyParam.email
                }
                sendConfirmEmail(confirmEmailObj).then( (res) => {});
              });
            } else {
              returnObj.success = false;
              returnObj.message = 'Parolele nu corespund';
              console.log('Parolele nu corespund');
            }
          } else {
            returnObj.success = false;
            returnObj.message = 'Utilizatorul deja exista';
            console.log('Utilizatorul deja exista')
          }
        } catch(error) {
          throw(error);
        }
        resolve(returnObj);
      });
    })
}
function sendConfirmEmail(arg) {
    return new Promise((resolve, reject) => {
        function generateRandomNumbers() {
            let randomNumberString = '';
            for (let i = 0; i < 6; i++) {
            const randomNumber = Math.floor(Math.random() * 10);
            randomNumberString += randomNumber;
            }
            return randomNumberString;
        }
        const code = generateRandomNumbers();
        const uuid = uuidv4();
        sendEmail({
            to : arg.email,
            subject : 'Verificare email',
            body : 'Codul de verificare email : ' + code
        });
        const sql = "INSERT INTO emailVerify (emailVerifyId, code, systemuserId)" + " VALUES('" + uuid + "','" + code + "','" + arg.userId + "')";
        executeCustomQuery(sql).then( (res) => {
            resolve(res);
        })
    })
}
function executeCustomQuery(arg) {
    return new Promise((resolve, reject) => {
        connection.query(arg, (error, results, fields) => {
        if (error) {
            reject(error);
        } else {
            resolve(results);
        }
        });
    });
}
function confirmAccount(arg) {
    let returnObj = {};
    const sql = "select * from emailverify a join systemuser b on a.systemuserid = b.systemuserid  where b.email = '" + arg.email + "'";
    return new Promise ((resolve, reject) => {
        executeCustomQuery(sql).then((res) => {
        if(arg.code == res[0].code) {
            const sqlSetVerified = "update systemuser set isVerified = 1 where systemuserId = '" + res[0].systemuserId + "'";
            executeCustomQuery(sqlSetVerified).then( (res) => {
            returnObj.isSuccess = true;
            returnObj.message = "Contul a fost activat";
            resolve(returnObj);
            });
        } else {
            returnObj.isSuccess = false;
            returnObj.message = "Codurile nu corespund";
            resolve(returnObj);
        }
        
        })
    })
}
function authenticate(body) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM user where email = '" + body.username + "'";
        executeCustomQuery(sql).then( (res) => {
            const returnObj = {
                authenticated : false,
                message : ''
            }
            if(md5(body.password) == res[0].password) {
                returnObj.message = 'Autentificare reusita';
                returnObj.authenticated = true;
            } else {
                returnObj.message = 'Autentificare nereusita - parola/email gresite';
                returnObj.authenticated = false;
            }
            resolve(returnObj);
        })
    })
}

function setUIComponent(body) {
    console.log(body);
    const uuid = uuidv4();
    const sql = "INSERT INTO uicomponents (uicomponentsid, html, createdOn, css, componentType, javascript) VALUES ('" 
    + uuid + "','" + body.html + "','" + (new Date()).toISOString() + "','" + body.css +  "','" + body.componentType + "','" + '' + "')";
    console.log(sql);
    return new Promise((resolve, reject) => {
        executeCustomQuery(sql).then( (res) => {
            if(!res.err) {
                resolve({res : res, uuid : uuid});
            } else {
                reject(res);
            }
        })
    })

}
function getUIComponents(arg) {
    const sql = "SELECT * FROM uicomponents where componentType = '" + arg.componentType + "'";
    return new Promise ((resolve, reject) => {
        executeCustomQuery(sql).then( (res) => {
            if(!res.err) {
                resolve(res);
            } else {
                reject(res);
            }
        })
    })
}
function deleteUIComponent(arg) {
    const sql = "DELETE FROM uicomponents where uicomponentsid = '" + arg.uicomponentsId + "'";
    return new Promise((resolve, reject) => {
        executeCustomQuery(sql).then((res) => {
            if(!res.err) {
                resolve(res);
            } else {
                reject(res);
            }
        })
    })
}
function getUIComponent(arg) {
    const sql = "SELECT * FROM uicomponents where uicomponentsid = '" + arg.uiComponentId + "'";
    return new Promise ((resolve, reject) => {
        executeCustomQuery(sql).then( (res) => {
            if(!res.err) {
                resolve(res);
            } else {
                reject(res);
            }
        })
    });
}
function updateUIComponent(arg) {
    console.log(arg);
    const sql = "UPDATE uicomponents set html = '" + arg.html.replace(/\n/g, "") + "' ,css = '" + arg.css.replace(/\n/g, "") + "' WHERE uicomponentsid = '" + arg.uicomponentsId + "'";
    console.log(sql)
    return new Promise((resolve, reject) => {
        executeCustomQuery(sql).then( (res) => {
            if(!res.err) {
                resolve(res);
            } else {
                reject(res);
            }
        });
    }) 
}
module.exports = {
    verifyToken,
    registerUser,
    confirmAccount,
    authenticate,
    verifyAuthCredentials,
    setUIComponent,
    getUIComponents,
    getUIComponent,
    deleteUIComponent,
    updateUIComponent,
}