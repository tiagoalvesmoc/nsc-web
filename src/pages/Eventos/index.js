import React, { useEffect, useState, useRef } from "react";
import firebaseConfig from "../../context/config";
import { initializeApp } from "firebase/app";

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

export default function Eventos() {
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
    eventoNome: "Culto",
    description: "",
    emailContato: "",
    dia: "",
    telefoneContato: "",
    local: "",
    horario: "",

    idEventosImages: uid,
    imagesEventos: [],
  });

  useEffect(() => {
    setLoading(true);

    const app = initializeApp(firebaseConfig);
    const liderColection = collection(getFirestore(), "eventos");

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

  const notify = () => {
    toast("Default Notification !");

    toast.success("Success Notification !", {
      position: toast.POSITION.TOP_CENTER,
    });

    toast.error("Error Notification !", {
      position: toast.POSITION.TOP_LEFT,
    });

    toast.warn("Warning Notification !", {
      position: toast.POSITION.BOTTOM_LEFT,
    });

    toast.info("Info Notification !", {
      position: toast.POSITION.BOTTOM_CENTER,
    });

    toast("Custom Style Notification with css class!", {
      position: toast.POSITION.BOTTOM_RIGHT,
      className: "foo-bar",
    });
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
        `eventos-images/${newEventoData.idEventosImages}/${uuid()}`
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

          notify();
        },

        (error) => {
          console.log(error);
          return;
        },
        () => {
          getDownloadURL(uploadTaskLiderAvatar.snapshot.ref)
            .then((downloadURL) => {
              setOpenDrawer(false);
              toast.success("Wow so easy !", {
                position: toast.POSITION.TOP_LEFT,
              });

              const user = doc(
                getFirestore(),
                "eventos/",
                newEventoData.idEventosImages
              );

              setDoc(
                doc(getFirestore(), "eventos", newEventoData.idEventosImages),
                newEventoData
              );

              const frankDocRef = doc(
                getFirestore(),
                "eventos",
                newEventoData.idEventosImages
              );
              updateDoc(frankDocRef, {
                avatarUrl: downloadURL,
              })
                .then(() => {
                  setProgressUpload(0);
                  setLoadPage(!loadPage);
                  // window.location.reload()
                })
                .catch((err) => alert(err));
            })
            .catch((err) => {
              console.log(err);
              // setLoadPage(!loadPage)
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
    setModalTempData(list);
    handleOpen();
  };
  const handleOpen = () => setOpen(!open);
  const handleClose = () => setOpen(false);

  return (
    <div className="col p-5 overflow-auto h-100">
      <div className="modal-container">
        <Modal full show={open} onClose={handleClose} onHide={handleOpen}>
          <Modal.Header>
            <Modal.Title>Eventos Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div class="card text-center">
              <div class="card-header"> </div>
              <div class="card-body">
                <div className="col">
                  <figure class="figure">
                    <img
                      src={modalTempData.avatarUrl}
                      class="figure-img img-fluid rounded"
                      alt="..."
                    />
                    <figcaption class="figure-caption"></figcaption>
                  </figure>
                  <div class="card-body">
                    <h2 class="card-title">{modalTempData?.eventoNome}</h2>
                    <p class="card-text">{modalTempData?.description}</p>
                  </div>
                </div>
              </div>
              <div class="card-footer text-muted">2 days ago</div>
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
              {userData?.title ? userData?.title : "Cadastrar Novo Evento(s)"}{" "}
              {userData?.lidernome}
            </h3>{" "}
          </Drawer.Title>

          <Drawer.Body>
            <div className="row mt-1">
              <div className="form-group col-5">
                <b className="h7 mb-35">
                  <strong>Evento Nome</strong>
                </b>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Evento Nome"
                  disabled={component.disable}
                  value={newEventoData.eventoNome}
                  onChange={(e) =>
                    setNewEventoData({
                      ...newEventoData,
                      eventoNome: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group col-5">
                <b className="h7 mb-35">
                  <strong>Local</strong>
                </b>
                <input
                  type="text"
                  className="form-control"
                  placeholder="local"
                  disabled={component.disable}
                  value={newEventoData.local}
                  onChange={(e) =>
                    setNewEventoData({
                      ...newEventoData,
                      local: e.target.value,
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
                  value={newEventoData.horario}
                  onChange={(e) =>
                    setNewEventoData({
                      ...newEventoData,
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
                  value={newEventoData.telefoneContato}
                  onChange={(e) =>
                    setNewEventoData({
                      ...newEventoData,
                      telefoneContato: e.target.value,
                    })
                  }
                />
              </div>
              <br />
              <div className="form-group col-5">
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
                  <h4>Banner Evento</h4>
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
            <h2>Eventos</h2>

            <button
              className="btn btn-primary btn-lg"
              onClick={() => {
                showDrawer(component, "Cadastrar Novo Evento");
              }}
            >
              Cadastrar Novo Evento
            </button>
          </div>

          <table className="table table-hover">
            <thead>
              <tr>
                <th scope="col">Banner Eventos</th>
                <th scope="col">Eventos Nome</th>
                <th scope="col">Local</th>
                <th scope="col">Horario</th>
                <th scope="col">Dia</th>
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

                    <td onClick={() => show()}>{list?.eventoNome}</td>
                    <td onClick={() => show()}>{list?.local}</td>
                    <td onClick={() => show()}>{list?.horario}</td>
                    <td onClick={() => show()}>{list?.dia}</td>

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
    </div>
  );
}
