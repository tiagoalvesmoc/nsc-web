import React, { useEffect, useState, useRef } from "react";
import firebaseConfig from "../../context/config";
import { initializeApp } from "firebase/app";
import { getDatabase, onValue, set, child } from "firebase/database";
import {
  collection,
  addDoc,
  getFirestore,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  setDoc,
} from "firebase/firestore";
import {
  getStorage,
  uploadBytes,
  uploadBytesResumable,
  ref,
  getDownloadURL,
  listAll,
  list,
} from "firebase/storage";
import { uuid } from "uuidv4";

import {
  Button,
  Drawer,
  Modal,
  Avatar,
  Uploader,
  Progress,
  Notification,
} from "rsuite";

export default function LiderCelula() {
  const message = (
    <div className="notification-container">
      <Notification closable type="info"></Notification>
      <Notification closable type="info" header="Informational"></Notification>
    </div>
  );
  const [result, setResult] = useState(uuid());
  const [uid, setUid] = useState(uuid());
  const [preview, setPreview] = useState({});
  const [imagesCelula, setImageCelulas] = useState([]);
  const [liderAvatar, setLiderAvatar] = useState([]);
  const [urlsAvatar, setUrlsAvatar] = useState([]);
  const [urlsCelulaFirebase, seturlsCelulaFirebase] = useState([]);
  const [listLider, setListLider] = useState([]);
  const [component, setComponents] = useState({
    disable: false,
    loading: false,
    title: "",
  });

  const [progressUpload, setProgressUpload] = useState(0);
  const [progresUploaCelulasImages, setprogresUploaCelulasImages] = useState(0);

  const [loading, setLoading] = useState(true);
  const [loadPage, setLoadPage] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [open, setOpen] = useState(false);
  const [userData, setUserData] = useState(false);
  const [modalTempData, setModalTempData] = useState({});
  const [id, setId] = useState(uuid());
  const [newLiderData, setNewLiderData] = useState({
    celulanome: "Gaditas",
    lidernome: "Tiago Alves",
    email: "tiagofarma39@gmail.com",
    dia: "sexta-feira",
    telefone: "38988116558",
    bairro: "monte carmelo",
    endereco: "rua 2, 33",
    horario: "19:00",
    idLideravatar: uid,
    idCelulasImages: uid,
    imagesCelulas: [],
    avatarUrl: "",
  });

  useEffect(() => {
    setLoading(true);

    const app = initializeApp(firebaseConfig);
    const liderColection = collection(getFirestore(), "lider");

    const getLider = async () => {
      const data = await getDocs(liderColection);
      setListLider(data.docs.map((doc) => ({ ...doc.data() })));

      setLoading(false);
    };

    getLider();
  }, [loadPage]);

  const updateLider = () => {
    console.log(newLiderData);

    window.location.reload();
  };

  //function **********************************//

  function stringToAlt(str) {
    // //-> String Original.
    // return str[0].toUpperCase() + str.substr(1);

    var subst = str?.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
      return a.toUpperCase();
    });
    return subst;
  }

  function show(data) {
    setOpenModal(true);
  }

  const handleOpen = () => setOpen(!open);
  const handleClose = () => setOpen(false);

  function showDrawer(data, title) {
    setOpenDrawer(true);
    setUserData({ ...data, title: title });
  }

  const handlerLiderAvatar = (e) => {
    var reader = new FileReader();

    for (let i = 0; i < e.target.files.length; i++) {
      const newImage = e.target.files[i];
      newImage["id"] = Math.random();
      setLiderAvatar((prevState) => [...prevState, newImage]);
    }
  };

  const handlerCelulasImages = (e) => {
    var reader = new FileReader();

    // reader.onload = () => {
    //     if (reader.readyState === 2) {
    //         setPreview(reader.result)

    //     }
    //     reader.readAsDataURL(e.target.files[0])
    // }

    for (let i = 0; i < e.target.files.length; i++) {
      const newImage = e.target.files[i];
      newImage["id"] = Math.random();
      setImageCelulas((prevState) => [...prevState, newImage]);
      // setResult(reader.readAsDataURL(e.target.files[0]))
    }
  };

  const handleUpload = async () => {
    setLoading(true);

    const storage = getStorage();

    const promisesAvatar = [];
    const promisescelulasImage = [];

    const metadata = {
      contentType: "image/jpeg",
    };
    const listurlcelular = [];

    //Subindo imagem avatar Lider
    liderAvatar.map((image) => {
      const storageRefLiderAvatar = ref(
        storage,
        `lider-avatar/${newLiderData.idLideravatar}/${uuid()}`
      );
      const uploadTaskLiderAvatar = uploadBytesResumable(
        storageRefLiderAvatar,
        image
      );
      promisesAvatar.push(uploadTaskLiderAvatar);

      uploadTaskLiderAvatar.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgressUpload(progress);
          setComponents({ ...component, title: "Uploading.." });
          console.log("Upload avatar " + progress + "% done");
        },

        (error) => {
          console.log(error);
          return;
        },
        () => {
          getDownloadURL(uploadTaskLiderAvatar.snapshot.ref)
            .then((downloadURL) => {
              const user = doc(
                getFirestore(),
                "lider/",
                newLiderData.idLideravatar
              );
              // updateDoc(user, {
              //     imagesCelulas: arrayUnion("greater_virginia")
              // });

              // const frankDocRef = doc(getFirestore(), "users", "frank");
              // updateDoc(frankDocRef, {
              //     name: downloadURL,
              //     favorites: { food: "Pizza", color: "Blue", subject: "recess" },
              //     age: 12,
              //     img: arrayUnion(downloadURL)
              // });

              setDoc(
                doc(getFirestore(), "lider", newLiderData.idLideravatar),
                newLiderData
              );

              const frankDocRef = doc(
                getFirestore(),
                "lider",
                newLiderData.idLideravatar
              );
              updateDoc(frankDocRef, {
                avatarUrl: downloadURL,
              });

              setUrlsAvatar((prevState) => [...prevState, `${downloadURL}`]);

              setProgressUpload(0);
              setImageCelulas([]);
              // setLoading(false)
            })
            .catch((err) => {
              console.log(err);
              // setLoadPage(!loadPage)
              return;
            });
        },

        //Subindo Imagens da celula

        imagesCelula.map((image) => {
          const storageRefCelulasImages = ref(
            storage,
            `celulas-images/${newLiderData.idCelulasImages}/${uuid()}`
          );
          const uploadTaskCelulasImages = uploadBytesResumable(
            storageRefCelulasImages,
            image
          );
          promisescelulasImage.push(uploadTaskCelulasImages);

          uploadTaskCelulasImages.on(
            "state_changed",
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setProgressUpload(progress);
              setComponents({ ...component, title: "Uploading.." });
              console.log("Upload Imagens Celula " + progress + "% done");
            },
            (err) => {
              console.log(err);
              alert(err);
              return;
            },

            () => {
              getDownloadURL(uploadTaskCelulasImages.snapshot.ref)
                .then(async (celulasImgUrl) => {
                  // seturlsCelulaFirebase((prevState) => [...prevState, `${celulasImgUrl}`]);
                  // console.log('File available at', celulasImgUrl);

                  const frankDocRef = doc(
                    getFirestore(),
                    "lider",
                    newLiderData.idLideravatar
                  );
                  updateDoc(frankDocRef, {
                    imagesCelulas: arrayUnion(celulasImgUrl),
                  })
                    .then(() => {
                      window.location.reload();
                    })
                    .catch((err) => {
                      alert(err);
                    });
                })
                .catch((err) => {
                  console.log(err);
                  return;
                  // setLoadPage(!loadPage)
                });
            }
          );
        })
      );
    });

    Promise.all(promisesAvatar)
      .then(() => {
        console.log("Avatar images uploaded");
        setLiderAvatar([]);
      })
      .catch((err) => console.log(err));

    Promise.all(promisescelulasImage)
      .then(() => {
        console.log("Celulas images uploaded");
        setImageCelulas([]);
      })
      .catch((err) => {
        console.log(err);
        alert(err);
      });
    // setComponents({
    //     loading: false,
    //     disable: false
    // })

    // setOpenDrawer(false)
    // localStorage.setItem('@uuid', uuid())
    // window.location.reload()
    // setLoadPage(!loadPage)
  };

  const sendFirestoreNewliderData = async () => {
    setLoading(true);
    const dbFirestore = getFirestore();

    await addDoc(collection(dbFirestore, "lider"), newLiderData)
      .then(() => {
        setComponents({
          loading: false,
          disable: false,
        });

        setOpenDrawer(false);
        localStorage.setItem("@uuid", uuid());
        window.location.reload();
        setLoadPage(!loadPage);
      })
      .catch((err) => {
        alert(err);
      });
  };

  return (
    <div className="col p-5 overflow-auto h-100">
      <div className="modal-container">
        <Modal full show={open} onClose={handleClose} onHide={handleOpen}>
          <Modal.Header>
            <Modal.Title>Live Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div class="card mb-3" style={{ maxWidth: 540 }}>
              <div class="row g-0">
                <div class="col-md-4">
                  <img
                    style={{ width: 540, height: 150 }}
                    src="https://i1.ytimg.com/vi/qz9ftctJ94c/mqdefault.jpg"
                    class="img-fluid rounded-start"
                    alt="..."
                  />
                </div>
                <div class="col-md-8">
                  <div class="card-body">
                    <h5 class="card-title">{modalTempData?.title}</h5>
                    <p class="card-text">{modalTempData?.description}</p>
                    <p class="card-text">
                      <small class="text-muted">Last updated 3 mins ago</small>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>{" "}
          <Modal.Footer>
            <Button
              onClick={() => handleClose()}
              color="green"
              appearance="primary"
            >
              Fechar
            </Button>
            <Button color="red" appearance="primary" onClick={() => {}}>
              Deletar Live
            </Button>
          </Modal.Footer>
        </Modal>
      </div>

      <Drawer
        show={openDrawer}
        size="lg"
        onHide={() => {
          setOpenDrawer(!openDrawer);
        }}
      >
        <Drawer.Header>
          <Drawer.Title>
            <h3 class="display-8">
              {userData?.title ? userData?.title : "Cadastrar Novo Lider"}{" "}
              {userData?.lidernome}
            </h3>{" "}
          </Drawer.Title>

          <Drawer.Body>
            <div className="row mt-1">
              <div className="form-group col-5">
                <b className="h7 mb-35">
                  <strong>Célula Nome</strong>
                </b>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Célula Nome"
                  disabled={component.disable}
                  value={newLiderData.celulanome}
                  onChange={(e) =>
                    setNewLiderData({
                      ...newLiderData,
                      celulanome: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group col-5">
                <b className="h7">
                  <strong>Nome Lìder Célula</strong>
                </b>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nome Lìder Célula"
                  disabled={component.disable}
                  value={newLiderData.lidernome}
                  onChange={(e) =>
                    setNewLiderData({
                      ...newLiderData,
                      lidernome: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group col-5">
                <b className="h7 mb-35">
                  <strong>Bairro</strong>
                </b>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Bairro"
                  disabled={component.disable}
                  value={newLiderData.bairro}
                  onChange={(e) =>
                    setNewLiderData({ ...newLiderData, bairro: e.target.value })
                  }
                />
              </div>
              <div className="form-group col-5">
                <b className="h7">
                  <strong>Endereco</strong>
                </b>
                <input
                  type="text"
                  className="form-control"
                  placeholder=" Endereco"
                  disabled={component.disable}
                  value={newLiderData.endereco}
                  onChange={(e) =>
                    setNewLiderData({
                      ...newLiderData,
                      endereco: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group col-5">
                <b className="h7">
                  <strong>Horário</strong>
                </b>
                <input
                  type="time"
                  className="form-control"
                  placeholder="Horário"
                  disabled={component.disable}
                  value={newLiderData.horario}
                  onChange={(e) =>
                    setNewLiderData({
                      ...newLiderData,
                      horario: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group col-5">
                <b className="h7">
                  <strong>Telefone/WathsApp</strong>
                </b>
                <input
                  type="tel"
                  className="form-control"
                  placeholder="Telefone/WathsApp"
                  disabled={component.disable}
                  value={newLiderData.telefone}
                  onChange={(e) =>
                    setNewLiderData({
                      ...newLiderData,
                      telefone: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group col-5">
                <b className="h7">
                  <strong> /id</strong>
                </b>
                <input
                  type="tel"
                  className="form-control"
                  disabled={true}
                  value={uid}
                  onChange={(e) =>
                    setNewLiderData({
                      ...newLiderData,
                      idLideravatar: e.target.value,
                    })
                  }
                  onClick={(e) =>
                    setNewLiderData({
                      ...newLiderData,
                      idLideravatar: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group col-6">
                <b className="h7">
                  <strong> /id</strong>
                </b>
                <input
                  type="tel"
                  className="form-control"
                  disabled={true}
                  value={uid}
                  onChange={(e) =>
                    setNewLiderData({
                      ...newLiderData,
                      idCelulasImages: e.target.value,
                    })
                  }
                  onClick={(e) =>
                    setNewLiderData({
                      ...newLiderData,
                      idCelulasImages: e.target.value,
                    })
                  }
                />
              </div>

              <div
                className="form-group col-6 "
                style={{ alignItems: "center" }}
              >
                <b className="h7">
                  <h4>Foto perfil Lider</h4>
                </b>
                <input
                  type="file"
                  onChange={handlerLiderAvatar}
                  placeholder="Selecione Avatar"
                />
                <br />

                <img
                  key="o"
                  style={{ width: 160, height: 160, borderRadius: 10 }}
                  src={preview || ""}
                />
              </div>

              <div
                className="form-group col-6 "
                style={{ alignItems: "center" }}
              >
                <b className="h7">
                  <h4>Fotos Celulas</h4>
                </b>
                <input
                  type="file"
                  multiple
                  onChange={handlerCelulasImages}
                  placeholder="Selecionar Fotos"
                  src={result}
                />
                <br />

                <img
                  key="o"
                  style={{ width: 160, height: 160, borderRadius: 10 }}
                  src={preview}
                />
              </div>

              <br />
              <br />
            </div>

            <Button
              block
              className="btn-lg btn-success mt-3"
              color={"green"}
              size="lg"
              onClick={() => handleUpload()}
              loading={component.loading}
              disabled={component.disable}
            >
              {loading ? (
                <Progress.Line
                  percent={progressUpload}
                  showInfo={component?.title}
                  strokeColor="blue"
                />
              ) : (
                "Cadastrar"
              )}
            </Button>
          </Drawer.Body>
        </Drawer.Header>
      </Drawer>

      <div className="row">
        <div className="col-12">
          <div className="w-100 d-flex justify-content-between ">
            <h2>Lider Célula</h2>

            <button
              className="btn btn-primary btn-lg"
              onClick={() => {
                showDrawer(component, "Cadastrar Novo Lider");
              }}
            >
              Cadastrar Novo Lider
            </button>
          </div>

          <table className="table table-hover">
            <thead>
              <tr>
                <th scope="col">Avatar</th>
                <th scope="col">Célula Nome</th>
                <th scope="col">Lider Nome</th>
                <th scope="col">Célula Bairro</th>
                <th scope="col">Célula Dia</th>
                <th scope="col">Célula Endereco</th>
                <th scope="col">Célula Horário</th>
                <th scope="col">Editar</th>
              </tr>
            </thead>

            {!loading ? (
              <tbody class="overflow-auto">
                {listLider?.map((lider) => (
                  <tr>
                    <th scope="row">
                      <Avatar circle src={lider.avatarUrl} alt="@" size="lg" />
                    </th>

                    <td onClick={() => show()}>
                      {stringToAlt(lider?.celulanome)}
                    </td>
                    <td onClick={() => show()}>
                      {stringToAlt(lider?.lidernome)}
                    </td>
                    <td onClick={() => show()}>{stringToAlt(lider?.bairro)}</td>
                    <td onClick={() => show()}>{lider?.dia}</td>
                    <td onClick={() => show()}>{lider?.endereco}</td>
                    <td onClick={() => show()}>{lider?.horario}</td>

                    <td onClick={() => showDrawer()}>
                      <Button
                        onClick={() => {}}
                        color="green"
                        appearance="primary"
                      >
                        Fechar
                      </Button>{" "}
                      <Button
                        color="red"
                        appearance="primary"
                        onClick={() => {
                          setModalTempData(lider);
                        }}
                      >
                        Deletar Live
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : (
              ""
            )}
          </table>

          {loading ? (
            <div className="text-center mt-100">
              <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          ) : (
            listLider.length <= 0 && (
              <div className="text-center mt-100">
                <div className="text-center" role="status">
                  <text>Nenhum dado encontrado</text>
                </div>
              </div>
            )
          )}
        </div>
        {/* <div className='row'>
                    <div className='col-sm-6'>



                        <div className="card"  >
                            <img className="card-img-top" src="https://firebasestorage.googleapis.com/v0/b/nossacasa-4d613.appspot.com/o/celulas-images%2F2092ef3f-0241-4955-893c-dd35c4c99411%2F464d2aff-a479-4899-af34-1df02cd74f86?alt=media&token=3d3c7793-e6ee-482e-aaee-cbe6ebca4ed0" alt="Card image cap" style={{ width: 150, height: 150 }} />
                            <div className="card-body">
                                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                            </div>
                        </div>
                        <br />


                    </div>

                </div> */}
      </div>
    </div>
  );
}
