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

export default function Live() {
  const [listEvents, setListEvents] = useState([]);
  const [component, setComponents] = useState({
    disable: false,
    loading: false,
    title: "",
  });

  const [loading, setLoading] = useState(true);
  const [loadPage, setLoadPage] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);

  const [id, setId] = useState(uuid());
  const [liveId, setLiveId] = useState();
  const [live, setLive] = useState({
    liveUrl: "",
    idYoutube: "",
    id: uuid(),
  });

  useEffect(() => {
    setLoading(true);

    const app = initializeApp(firebaseConfig);
    const liderColection = collection(getFirestore(), "lives");

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

  function showLiveData(id) {
    setLiveId(id);
    setOpenModal(true);
  }

  const deleteLive = async () => {
    // [START delete_document]

    deleteDoc(doc(getFirestore(), "lives", liveId))
      .then(() => {
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

  function showDrawer(data, title) {
    setOpenDrawer(true);
  }

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
  const setLiveFirestore = async () => {
    const DocRef = doc(getFirestore(), "lives", live.id);
    setDoc(DocRef, live)
      .then(async () => {
        let dd = await stractId(live.liveUrl);

        await updateDoc(DocRef, {
          idYoutube: `${dd}`,
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

    // setDoc(doc(getFirestore(), "lives", live.id), live)
    //   .then(() => {

    //     updateDoc.

    //     notify("success", "Cadastrado com sucesso");
    //     setTimeout(() => {
    //       window.location.reload();
    //     }, 2500);
    //   })
    //   .catch((err) => {
    //     notify("error", err);
    //     setTimeout(() => {
    //       window.location.reload();
    //     }, 2500);
    //   });
  };

  return (
    <div className="col p-5 overflow-auto h-100">
      <Modal
        show={openModal}
        onHide={() => {
          setOpenModal(!openModal);
        }}
        size="xs"
        style={{ backgroundColor: "rgb(0, 0, 0,0.5)" }}
      >
        <Modal.Header>
          <Modal.Title>Live Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <b className="h7 mb-35">
            <strong>{liveId}</strong>
          </b>
        </Modal.Body>{" "}
        <Modal.Footer>
          <Button
            onClick={() => setOpenModal(false)}
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

      <Drawer
        show={openDrawer}
        size="sm"
        onHide={() => {
          setOpenDrawer(!openDrawer);
        }}
      >
        <Drawer.Header>
          <Drawer.Title>
            <h3 class="display-8">Cadastrar Nova Live</h3>{" "}
          </Drawer.Title>

          <Drawer.Body>
            <div className="form-group col-6">
              <b className="h7 mb-35">
                <strong>URL - Live</strong>
              </b>
              <br />

              <input
                type="text"
                className="form-control "
                placeholder=" live url"
                disabled={""}
                value={live.liveUrl}
                onChange={(e) => setLive({ ...live, liveUrl: e.target.value })}
              />
            </div>

            <Button
              block
              className="btn-lg btn-success mt-3"
              color={"green"}
              size="sm"
              onClick={setLiveFirestore}
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
            <h2>Lives</h2>

            <button
              className="btn btn-primary btn-lg"
              onClick={() => {
                showDrawer(component, "Cadastrar Novo Evento");
              }}
            >
              Cadastrar Live
            </button>
          </div>

          <table className="table table-hover">
            <thead>
              <tr>
                <th scope="col">Live Url</th>
                <th>Id</th>
              </tr>
            </thead>

            {!loading ? (
              <tbody>
                {listEvents.map((list) => {
                  console.log(list);
                })}
                {listEvents.map((list) => (
                  <tr>
                    <td
                      onClick={() => showLiveData(list?.id)}
                      className="col-10"
                    >
                      {list?.liveUrl}
                    </td>
                    <td
                      onClick={() => showLiveData(list?.id)}
                      className="col-10"
                    >
                      {list?.idYoutube}
                    </td>

                    <td onClick={() => showLiveData(list?.id)}>
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
