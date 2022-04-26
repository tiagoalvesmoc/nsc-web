import React, { useEffect, useState, useRef } from "react";
import firebaseConfig from "../../context/config";
import { initializeApp } from "firebase/app";
import { stringToAlt } from "../../Utils";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  addDoc,
  collection,
  getFirestore,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import {
  getStorage,
  uploadBytesResumable,
  ref,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { uuid } from "uuidv4";

import {
  Button,
  Drawer,
  Modal,
  Avatar,
  Uploader,
  Loader,
  Progress,
  Notification,
} from "rsuite";
import { async } from "@firebase/util";

export default function LiderCelula() {
  const message = (
    <div className="notification-container">
      <Notification closable type="info"></Notification>
      <Notification closable type="info" header="Informational"></Notification>
    </div>
  );

  const [uid, setUid] = useState(uuid());

  const [imagesCelula, setImageCelulas] = useState([]);
  const [liderAvatar, setLiderAvatar] = useState([]);

  const [listLider, setListLider] = useState([]);
  const [component, setComponents] = useState({
    disable: false,
    loading: false,
    title: "",
  });

  const [progressUpload, setProgressUpload] = useState(0);

  const [loading, setLoading] = useState(true);
  const [loadPage, setLoadPage] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [open, setOpen] = useState(false);
  const [userData, setUserData] = useState(false);
  const [modalTempData, setModalTempData] = useState({});
  const [id, setId] = useState(uuid());
  const [newLiderData, setNewLiderData] = useState({
    celulanome: "",
    id: uid,
    lidernome: "",
    email: "",
    dia: "sexta-feira",
    bairro: "monte carmelo",
    endereco: "rua 2, 33",
    horario: "19:00",
    idLideravatar: uid,
    idCelulasImages: uid,
    imagesCelulas: [],
    avatarUrl: "",

    telefone: "",
    linkInstagram: "",
    linkWhatsApp: "",
    linkFacebook: "",
  });

  useEffect(() => {
    setLoading(true);

    const liderColection = collection(getFirestore(), "celulas");

    const getLider = async () => {
      const data = await getDocs(liderColection);
      setListLider(data.docs.map((doc) => ({ ...doc.data() })));
      console.log("Lider", listLider);
      setLoading(false);
    };

    getLider();
  }, [loadPage]);

  function show(data) {
    setOpenModal(true);
  }

  const handleOpen = () => setOpen(!open);
  const handleClose = () => setOpen(false);

  function showDrawer(data, title) {
    setOpenDrawer(true);
    setUserData({ ...data, title: title });
  }

  const handleDelete = async (data) => {
    // [START delete_document]

    console.log(id);

    deleteDoc(doc(getFirestore(), "celulas", data.id))
      .then(() => {
        // handleDeleteStorage(data);

        notify("success", "Tudo certo");
      })
      .catch(() => {
        notify("error", "Ops..ocorreu um erro, tente novamente.");
        setLoadPage(!loadPage);
      });
    // [END delete_document]
  };

  // const handleDeleteStorage = async (data) => {
  //   const deleteStorage = ref(
  //     getStorage(),
  //     `celulas-img/${data.id}/${data.avatarUrl}`
  //   );
  //   deleteObject(deleteStorage)
  //     .then(() => {
  //       setOpen(false);
  //       notify("success", "Deletado");
  //       setLoadPage(!loadPage);
  //     })

  //     .catch(() => {
  //       setOpen(false);
  //       notify("error", "Ops..ocorreu um erro, tente novamente.");
  //       setLoadPage(!loadPage);
  //     });
  // };

  function previewFile(file, callback) {
    const reader = new FileReader();
    reader.onloadend = () => {
      callback(reader.result);
    };
    reader.readAsDataURL(file);
  }

  const handleUpload = async () => {
    setLoading(true);

    const storage = getStorage();

    const promisesAvatar = [];
    const promisescelulasImage = [];

    //Subindo imagem avatar Lider
    await liderAvatar.map((image) => {
      const storageRefLiderAvatar = ref(
        storage,
        `celulas-img/${newLiderData.id}/${uuid()}`
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
              doc(getFirestore(), "celulas/", newLiderData.id);

              setDoc(
                doc(getFirestore(), "celulas/", newLiderData.id),
                newLiderData
              );

              // const frankDocRef = doc(
              //   getFirestore(),
              //   "lider",
              //   newLiderData.idLideravatar
              // );
              updateDoc(doc(getFirestore(), "celulas/", newLiderData.id), {
                avatarUrl: downloadURL,
              });

              setProgressUpload(0);
              setImageCelulas([]);
              // setLoading(false)
            })
            .catch((err) => {
              console.log(err);
              // setLoadPage(!loadPage)
              return;
            });
        }
      );
    });

    await imagesCelula.map((image) => {
      const storageRefCelulasImages = ref(
        storage,
        `celulas-img/${newLiderData.idCelulasImages}/${uuid()}`
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

              updateDoc(doc(getFirestore(), "celulas/", newLiderData.id), {
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

  const notify = (type, message) => {
    setOpenDrawer(false);
    setOpenModal(false);
    switch (type) {
      case "success":
        return toast.success(message, {
          position: toast.POSITION.TOP_LEFT,
        });
      case "error":
        toast.error(message, {
          position: toast.POSITION.TOP_LEFT,
        });

      default:
        break;
    }
  };

  const modalOpen = (data) => {
    setOpen(true);
    setModalTempData(data);
  };

  return (
    <div className="col p-5 overflow-auto h-100">
      <div className="modal-container">
        <Modal
          full
          show={open}
          onClose={handleClose}
          onHide={handleOpen}
          size="lg"
        >
          <Modal.Header>
            <Modal.Title>Celulas Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div class="card mb-3" style={{ maxWidth: 540 }}>
              <div class="row g-0">
                <div class="col-md-4">
                  <img
                    style={{ width: 540, height: 150 }}
                    src={modalTempData?.avatarUrl}
                    class="img-fluid rounded-start"
                    alt="..."
                  />
                </div>
                <div class="col-md-8">
                  <div class="card-body">
                    <h5 class="card-title">{modalTempData?.celulanome}</h5>
                    <p class="card-text">{modalTempData?.bairro}</p>
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
            <Button
              color="red"
              appearance="primary"
              onClick={() => handleDelete(modalTempData?.id)}
            >
              Deletar
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
              {userData?.title ? userData?.title : "Cadastrar Novo(a) Célula"}{" "}
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
                  <strong>linkInstagram</strong>
                </b>
                <input
                  type="tel"
                  className="form-control"
                  placeholder="instagram url"
                  disabled={component.disable}
                  value={newLiderData.linkInstagram}
                  onChange={(e) =>
                    setNewLiderData({
                      ...newLiderData,
                      linkInstagram: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group col-5">
                <b className="h7">
                  <strong>link WhatsApp</strong>
                </b>
                <input
                  type="tel"
                  className="form-control"
                  placeholder="whatsapp url"
                  disabled={component.disable}
                  value={newLiderData.linkWhatsApp}
                  onChange={(e) =>
                    setNewLiderData({
                      ...newLiderData,
                      linkWhatsApp: e.target.value,
                    })
                  }
                />
              </div>

              <div
                className="form-group col-8 "
                style={{ alignItems: "center" }}
              >
                <b className="h7">
                  <h4>Foto perfil Lider/Banner</h4>
                </b>

                <Uploader
                  multiple={false}
                  autoUpload={false}
                  listType="picture-text"
                  onChange={(files) => {
                    const arquivos = files
                      .filter((f) => f.blobFile)
                      .map((f) => f.blobFile);

                    setLiderAvatar(arquivos);
                    // setImageSpotLight(() => [...imagesSpotLight, arquivos]);
                    // setImageSpotLight((prevState) => [arquivos[prevState]]);
                    console.log(liderAvatar);
                  }}
                  onUpload={(file) => {
                    setLoading(true);
                    previewFile(file.blobFile, (value) => {
                      setLiderAvatar(value);
                    });
                  }}
                  onRemove={(f) => console.log(f)}
                ></Uploader>
                <br />
              </div>

              <div
                className="form-group col-6 "
                style={{ alignItems: "center" }}
              >
                <b className="h7">
                  <h4>Fotos Celulas</h4>
                </b>
                {/* <input
                  type="file"
                  multiple
                  onChange={handlerCelulasImages}
                  placeholder="Selecionar Fotos"
                  src={result}
                /> */}

                {/* <img
                  key="o"
                  style={{ width: 160, height: 160, borderRadius: 10 }}
                  src={preview}
                /> */}

                <Uploader
                  multiple
                  autoUpload={false}
                  listType="picture-text"
                  onChange={(files) => {
                    const arquivos = files
                      .filter((f) => f.blobFile)
                      .map((f) => f.blobFile);

                    setImageCelulas(arquivos);
                    // setImageSpotLight(() => [...imagesSpotLight, arquivos]);
                    // setImageSpotLight((prevState) => [arquivos[prevState]]);
                    console.log(liderAvatar);
                  }}
                  onUpload={(file) => {
                    setLoading(true);
                    previewFile(file.blobFile, (value) => {
                      setImageCelulas(value);
                    });
                  }}
                  onRemove={(f) => console.log(f)}
                ></Uploader>
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
            <h2>Células</h2>

            <button
              className="btn btn-primary btn-lg"
              onClick={() => {
                showDrawer(component, "Cadastrar Novo(a) Célula");
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
                      <Avatar src={lider.avatarUrl} alt="@" size="lg" />
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

                    <td>
                      <Button
                        onClick={() => modalOpen(lider)}
                        color="green"
                        appearance="primary"
                      >
                        edit
                      </Button>{" "}
                      <Button
                        color="red"
                        appearance="primary"
                        onClick={() => {
                          handleDelete(lider);
                        }}
                      >
                        Deletar
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

      <ToastContainer />
    </div>
  );
}
