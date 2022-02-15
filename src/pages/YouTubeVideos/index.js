import React, { useEffect, useState, useRef } from "react";
import firebaseConfig from "../../context/config";
import { initializeApp } from "firebase/app";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { uuid } from "uuidv4";

import {
  collection,
  getFirestore,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

import { Button, Drawer, Modal, Progress } from "rsuite";

export default function YouTubeVideos() {
  const [open, setOpen] = useState(false);

  const [listEvents, setListEvents] = useState([]);
  const [component, setComponents] = useState({
    disable: false,
    loading: false,
    title: "",
  });

  const [loading, setLoading] = useState(true);
  const [loadPage, setLoadPage] = useState(false);

  const [openModal, setOpenModal] = useState(true);
  const [modalTempData, setModalTempData] = useState({});
  const [openDrawer, setOpenDrawer] = useState(false);

  const [liveId, setLiveId] = useState();
  const [live, setLive] = useState({
    liveUrl: "",
    liveId: "",
    id: uuid(),
    title: "",
    description: "",
  });

  useEffect(() => {
    setLoading(true);

    const app = initializeApp(firebaseConfig);
    const liderColection = collection(getFirestore(), "videos-you-tube-url");

    const getEvents = async () => {
      const data = await getDocs(liderColection);
      setListEvents(data.docs.map((doc) => ({ ...doc.data() })));
      console.log(listEvents);

      setLoading(false);
    };

    getEvents();
  }, [loadPage]);

  //function **********************************//

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

  const modalParseData = (list) => {
    setModalTempData(list);
    handleOpen();
  };
  const handleOpen = () => setOpen(!open);
  const handleClose = () => setOpen(false);

  const stractId = async (url) => {
    let regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;

    let match = url.match(regExp);

    if (match && match[2].length == 11) {
      return match[2]; // use console.log if your run code in browser console
    } else {
      //error
      console.log("error");
    }
  };

  const deleteLive = async () => {
    // [START delete_document]

    deleteDoc(doc(getFirestore(), "videos-you-tube-url", modalTempData?.id))
      .then(() => {
        handleClose();
        notify("success", "Deletado");
        setTimeout(() => {
          setLoadPage(!loadPage);
          //   window.location.reload();
        }, 2000);
      })
      .catch((err) => {
        handleClose();
        notify("error", "Ops..ocorreu um erro, tente novamente.");
        setTimeout(() => {
          setLoadPage(!loadPage);
          //   window.location.reload();
        }, 2000);
      });
    // [END delete_document]
  };

  function showDrawer(data, title) {
    setOpenDrawer(true);
  }

  const setLiveFirestore = async () => {
    // Create an initial document to update.
    const DocRef = doc(getFirestore(), "videos-you-tube-url", live.id);
    setDoc(DocRef, live)
      .then(async () => {
        let dd = await stractId(live.liveUrl);
        // To update age and favorite color:
        await updateDoc(DocRef, {
          liveId: `${dd}`,
        })
          .then(() => {
            notify("success", "Cadastrado com sucesso");
            setTimeout(() => {
              setLoadPage(!loadPage);
              window.location.reload();
            }, 2000);
          })
          .catch((err) => {
            notify("error", err);
            setTimeout(() => {
              setLoadPage(!loadPage);
              window.location.reload();
            }, 2000);
          });
      })
      .catch((err) => {
        notify("error", err);
        setTimeout(() => {
          setLoadPage(!loadPage);
          //   window.location.reload();
        }, 2000);
      });

    // [END update_document_nested]
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
                    src={`https://i1.ytimg.com/vi/${modalTempData.liveId}/mqdefault.jpg`}
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
            <Button color="red" appearance="primary" onClick={deleteLive}>
              Deletar Live
            </Button>
          </Modal.Footer>
        </Modal>
      </div>

      <Drawer
        show={openDrawer}
        size="sm"
        onHide={() => {
          setOpenDrawer(!openDrawer);
        }}
      >
        <Drawer.Header>
          <Drawer.Title>
            <h3 class="display-8">Cadastrar Novo Video</h3>{" "}
          </Drawer.Title>

          <Drawer.Body>
            <div className="form-group col-6">
              <b className="h7 mb-35">
                <strong>URL Video YouTube</strong>
              </b>
              <br />

              <input
                type="text"
                className="form-control "
                placeholder="url you-tube"
                disabled={""}
                value={live.liveUrl}
                onChange={(e) => setLive({ ...live, liveUrl: e.target.value })}
              />
              <input
                type="text"
                className="form-control "
                placeholder="Titulo"
                disabled={""}
                value={live.title}
                onChange={(e) => setLive({ ...live, title: e.target.value })}
              />

              <textarea
                type="text"
                className="form-control "
                placeholder="Descrição"
                disabled={""}
                value={live.description}
                onChange={(e) =>
                  setLive({ ...live, description: e.target.value })
                }
              />
            </div>

            <Button
              block
              className="btn-lg btn-success mt-3"
              color={"green"}
              size="sm"
              onClick={() => setLiveFirestore()}
              loading={component.loading}
              disabled={component.disable}
            >
              {loading ? (
                <Progress.Line
                  percent={0}
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
            <h2>YouTube Videos</h2>

            <button
              className="btn btn-primary btn-lg"
              style={{ backgroundColor: "#000" }}
              onClick={() => {
                showDrawer(component, "Cadastrar Novo Evento");
              }}
            >
              Cadastrar Video
            </button>
          </div>

          <table className="table table-hover">
            <thead>
              <tr>
                <th scope="col">Videos - URL</th>
                <th>Titulo</th>
                <th>Video ID</th>
              </tr>
            </thead>

            {!loading ? (
              <tbody>
                {listEvents.map((list) => (
                  <tr>
                    <td onClick={() => modalParseData(list)} className="col-4">
                      {list?.liveUrl}
                    </td>
                    <td onClick={() => modalParseData(list)} className="col-3">
                      {list?.title}
                    </td>
                    <td onClick={() => modalParseData(list)} className="col-3">
                      {list?.liveId}
                    </td>

                    <td onClick={() => modalParseData(list)} className="col-2">
                      <a>
                        <Button color="red" appearance="primary">
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
