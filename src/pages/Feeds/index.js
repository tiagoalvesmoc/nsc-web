import React, { useEffect, useState, useRef } from "react";
import firebaseConfig from "../../context/config";
import { initializeApp } from "firebase/app";

import {
  collection,
  addDoc,
  getFirestore,
  getDocs,
  doc,
  deleteDoc,
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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Button,
  Drawer,
  Modal,
  Avatar,
  Uploader,
  Progress,
  Notification,
} from "rsuite";

export default function Feeds() {
  const message = (
    <div className="notification-container">
      <Notification closable type="info"></Notification>
      <Notification closable type="info" header="Informational"></Notification>
    </div>
  );

  const [uid, setUid] = useState(uuid());
  const [preview, setPreview] = useState({});

  const [liderAvatar, setLiderAvatar] = useState([]);

  const [listEvents, setListEvents] = useState([]);
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

  const [userData, setUserData] = useState(false);
  const [open, setOpen] = useState(false);
  const [modalTempData, setModalTempData] = useState({});
  const [id, setId] = useState(uuid());
  const [newEventoData, setNewEventoData] = useState({
    titulo: "",
    subTitulo: "",
    urlYouTube: "",
    description: "",

    idEventosImages: uid,
    imagesEventos: [],
  });

  useEffect(() => {
    setLoading(true);

    const app = initializeApp(firebaseConfig);
    const liderColection = collection(getFirestore(), "feeds");

    toast.success("Success Notification !", {
      position: toast.POSITION.TOP_CENTER,
    });

    const getEvents = async () => {
      const data = await getDocs(liderColection);
      setListEvents(data.docs.map((doc) => ({ ...doc.data() })));

      setLoading(false);
    };

    getEvents();
  }, [loadPage]);

  //function **********************************//

  function stringToAlt(str) {
    // //-> String Original.
    // return str[0].toUpperCase() + str.substr(1);

    var subst = str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
      return a.toUpperCase();
    });
    return subst;
  }

  function show(data) {
    setOpenModal(true);
  }

  function showDrawer(data, title) {
    setOpenDrawer(true);
    setUserData({ ...data, title: title });
  }

  const handlerEventoBanner = (e) => {
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
      setLiderAvatar((prevState) => [...prevState, newImage]);
    }
  };

  const deleteLive = async () => {
    // [START delete_document]

    deleteDoc(doc(getFirestore(), "feeds", modalTempData?.idEventosImages))
      .then(() => {
        setOpen(false);
        notify("success", "Deletado");
        setTimeout(() => {
          window.location.reload();
        }, 2500);
      })
      .catch((err) => {
        notify("error", "Ops..ocorreu um erro, tente novamente.");
        setTimeout(() => {
          window.location.reload();
        }, 2500);
      });
    // [END delete_document]
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

    // INCIANDO UPLOAD IMAGENS DOS EVENTOS

    liderAvatar.map((image) => {
      const storageRefEventos = ref(
        storage,
        `feeds/${newEventoData.idEventosImages}/${uuid()}`
      );
      const uploadTaskLiderAvatar = uploadBytesResumable(
        storageRefEventos,
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
          console.log(
            " INCIANDO UPLOAD IMAGENS DOS EVENTOS " + progress + "% done"
          );
        },

        (error) => {
          console.log(error);
          return;
        },
        () => {
          getDownloadURL(uploadTaskLiderAvatar.snapshot.ref)
            .then((downloadURL) => {
              setOpenDrawer(false);

              const user = doc(
                getFirestore(),
                "feeds/",
                newEventoData.idEventosImages
              );

              setDoc(
                doc(getFirestore(), "feeds", newEventoData.idEventosImages),
                newEventoData
              );

              const frankDocRef = doc(
                getFirestore(),
                "feeds",
                newEventoData.idEventosImages
              );
              updateDoc(frankDocRef, {
                avatarUrl: downloadURL,
              })
                .then(() => {
                  setProgressUpload(0);
                  setLoadPage(!loadPage);
                  notify("success", "success");
                  // window.location.reload()
                })
                .catch((err) => {
                  notify("error", err);
                  alert(err);
                });
            })
            .catch((err) => {
              notify("error", err);
              console.log(err);
              setLoadPage(!loadPage);
              return;
            });
        }
      );
    });

    // FIM DO UPLOAD E CADASTRO DO EVENTO

    Promise.all(promisesAvatar)
      .then(() => {
        console.log("  images uploaded");
        setLiderAvatar([]);
      })
      .catch((err) => console.log(err));
  };

  const modalParseData = (list) => {
    console.log(list);
    setModalTempData(list);
    handleOpen();
  };
  const handleOpen = () => setOpen(!open);
  const handleClose = () => setOpen(false);

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

  return (
    <div className="col p-5 overflow-auto h-100">
      <div className="modal-container">
        <Modal full show={open} onClose={handleClose} onHide={handleOpen}>
          <Modal.Header>
            <Modal.Title>Feeds Details</Modal.Title>
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
                    <h5 class="card-title">{modalTempData?.titulo}</h5>
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
            <Button color="red" appearance="primary" onClick={deleteLive}>
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
              {userData?.title ? userData?.title : "Cadastrar Novo feed(s)"}{" "}
              {userData?.lidernome}
            </h3>{" "}
          </Drawer.Title>

          <Drawer.Body>
            <div className="row mt-1">
              <div className="form-group col-5">
                <b className="h7 mb-35">
                  <strong>Feed Titulo</strong>
                </b>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Evento Nome"
                  disabled={component.disable}
                  value={newEventoData.titulo}
                  onChange={(e) =>
                    setNewEventoData({
                      ...newEventoData,
                      titulo: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group col-5">
                <b className="h7 mb-35">
                  <strong>Sub-Titulo</strong>
                </b>
                <input
                  type="text"
                  className="form-control"
                  placeholder="local"
                  disabled={component.disable}
                  value={newEventoData.subTitulo}
                  onChange={(e) =>
                    setNewEventoData({
                      ...newEventoData,
                      subTitulo: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group col-5">
                <b className="h7">
                  <strong>Descrição</strong>
                </b>
                <textarea
                  type="text"
                  className="form-control "
                  placeholder="Descrição"
                  disabled={""}
                  value={newEventoData.description}
                  onChange={(e) =>
                    setNewEventoData({
                      ...newEventoData,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group col-5">
                <b className="h7">
                  <strong>URL - Video You Tube</strong>
                </b>
                <input
                  type="text"
                  className="form-control "
                  placeholder="Descrição"
                  disabled={""}
                  value={newEventoData.urlYouTube}
                  onChange={(e) =>
                    setNewEventoData({
                      ...newEventoData,
                      urlYouTube: e.target.value,
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
                    setNewEventoData({
                      ...newEventoData,
                      idEventosImages: e.target.value,
                    })
                  }
                />
              </div>

              <div
                className="form-group col-6 "
                style={{ alignItems: "center" }}
              >
                <b className="h7">
                  <h4>Banner Feeds</h4>
                </b>
                <input
                  type="file"
                  onChange={handlerEventoBanner}
                  placeholder="Selecione Avatar"
                />
                <br />

                <img
                  key="o"
                  style={{ width: 160, height: 160, borderRadius: 10 }}
                  src={preview || ""}
                />
              </div>
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
            <h2>Feeds</h2>

            <button
              className="btn btn-primary btn-lg"
              onClick={() => {
                showDrawer(component, "Cadastrar Novo Evento");
              }}
            >
              Cadastrar Novo Feeds
            </button>
          </div>

          <table className="table table-hover">
            <thead>
              <tr>
                <th scope="col">Banner Feeds</th>
                <th scope="col">Titulo</th>
                <th scope="col">Sub-Titulo</th>

                <th scope="col">Editar</th>
              </tr>
            </thead>

            {!loading ? (
              <tbody>
                {listEvents.map((list) => (
                  <tr>
                    <th scope="row">
                      <Avatar circle src={list.avatarUrl} alt="@" size="lg" />
                    </th>

                    <td onClick={() => modalParseData(list)}>{list?.titulo}</td>
                    <td onClick={() => modalParseData(list)}>
                      {list?.subTitulo}
                    </td>

                    <td>
                      <Button
                        color="green"
                        appearance="primary"
                        onClick={() => modalParseData(list)}
                      >
                        Editar
                      </Button>{" "}
                      <a>
                        <Button
                          color="red"
                          appearance="primary"
                          onClick={() => modalParseData(list)}
                        >
                          Deletar
                        </Button>
                      </a>
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
            listEvents.length <= 0 && (
              <div className="text-center mt-100">
                <div className="text-center" role="status">
                  <text>Nenhum dado encontrado</text>
                </div>
              </div>
            )
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
