import React, { useEffect, useState } from "react";
import { withRouter } from "react-router";
import { BrowserRouter as Router, useHistory } from "react-router-dom";
import { Container, Form, Modal, Table, Spinner, Alert, Button, ButtonGroup } from "react-bootstrap";
import config from "../config/front_config";

const AdminPage = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState();
    const [error, setError] = useState();
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState();
    const [itemToDeleteIndex, setItemToDelete] = useState();
    const [showEditView, setShowEditView] = useState();
    const [itemToEditIndex, setItemToEdit] = useState();
    const history = useHistory();
    const [currentEditingUser, setCurrentEditingUser] = useState();

    useEffect(() => {
        getUsers();
    }, []);

    const getUsers = async () => {
        const token = localStorage.getItem("authToken");
        if (token) {
            try {
                setIsLoading(true);
                const users = await fetch(config.api.adminGetAllUsers, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token,
                    },
                    method: "GET"
                }).then(res => res.json());
                setIsLoading(false);
                if (users && users['data'] && users['data'].length) {
                    setUsers(users['data']);
                } else {
                    setError('Sorry!, No records found!');
                }
            }
            catch (err) {
                setError('Sorry!, Got issue on loading the records');
                setIsLoading(false);
            }
        } else {
            history.push('/login');
        }
    }

    const deleteConfermation = () => {
        if (showDeleteConfirmation) {
            return (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        textAlign: 'center',
                        backgroundColor: 'rgba(16, 16, 16, 0.5)',
                        zIndex: 999
                    }}>
                    <Modal.Dialog>
                        <Modal.Header>
                            <Modal.Title>Delete user!</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p>do confirm it.</p>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={() => setShowDeleteConfirmation(false)} variant="secondary">No, Don't</Button>
                            <Button onClick={() => confirmDelete()} variant="danger">yes, Delete</Button>
                        </Modal.Footer>
                    </Modal.Dialog>
                </div>
            );
        }
    }

    const deleteItem = (itemIndex) => {
        setShowDeleteConfirmation(true);
        setItemToDelete(itemIndex);
    }

    const confirmDelete = () => {
        setShowDeleteConfirmation(false);
        const token = localStorage.getItem("authToken");
        if (token) {
            setIsLoading(true);
            fetch(config.api.adminDeleteUser, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
                method: "POST",
                body: JSON.stringify({
                    id: users[itemToDeleteIndex].id,
                    token: users[itemToDeleteIndex].token
                })
            }).then(res => res.json()).then(data => {
                setIsLoading(false);
                if (data['success']) {
                    const newUserList = users;
                    newUserList.splice(itemToDeleteIndex, 1);
                    setUsers(newUserList);
                    setItemToDelete(undefined);
                    if (!(users && users.length)) {
                        setError('Sorry!, No records found!');
                    }
                } else {
                    setError(data['message'] ? data['message'] : 'Issue on deleting user');
                }
            })
                .catch(err => {
                    setIsLoading(false);
                    setError("Issue on deleting! ", err);
                })
        } else {
            history.push('/login');
        }
    }

    const editItem = (index) => {
        setCurrentEditingUser(users[index]);
        setItemToEdit(index);
        setShowEditView(true);
    }

    const handleChange = (value, key) => {
        const currentVal = currentEditingUser;
        currentVal[key] = value;
        setCurrentEditingUser(currentVal);
    }

    const validateEmail = (email) => {
        if (!email) { return false; }
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    const update = () => {
        console.log("currentEditingUser", currentEditingUser);
        if (validateEmail(currentEditingUser['candidate_email'])) {
            const token = localStorage.getItem("authToken");
            if (token) {
                setIsLoading(true);
                fetch(config.api.adminUpdate, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token,
                    },
                    method: "POST",
                    body: JSON.stringify({
                        ...currentEditingUser
                    })
                }).then(res => res.json()).then(data => {
                    setIsLoading(false);
                    if (data['status']) {
                        delete data['status'];
                        delete data['data'];
                        const usersList = users;
                        usersList[itemToEditIndex] = data;
                        setShowEditView(false);
                    } else {
                        alert(data['message'] ? data['message'] : 'Issue on updating user');
                    }
                })
                    .catch(err => {
                        setIsLoading(false);
                        setError("Issue on deleting! ", err);
                    })
            } else {
                history.push('/login');
            }
        } else {
            alert("Candidate Email should be valid");
        }
    }

    const editUserView = () => {
        if (showEditView) {
            return (
                <Modal.Dialog>
                    <Modal.Header>
                        <Modal.Title>Update user!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group>
                                <Form.Label>Candidate First Name</Form.Label>
                                <Form.Control defaultValue={currentEditingUser['candidate_name_first']} onChange={(event) => handleChange(event.target.value, 'candidate_name_first')} />
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Candidate Last Name</Form.Label>
                                <Form.Control defaultValue={currentEditingUser['candidate_name_last']} onChange={(event) => handleChange(event.target.value, 'candidate_name_last')} />
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Candidate Email</Form.Label>
                                <Form.Control defaultValue={currentEditingUser['candidate_email']} onChange={(event) => handleChange(event.target.value, 'candidate_email')} />
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Interviewer First Name</Form.Label>
                                <Form.Control defaultValue={currentEditingUser['interviewer_name_first']} onChange={(event) => handleChange(event.target.value, 'interviewer_name_first')} />
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Interviewer Last Name</Form.Label>
                                <Form.Control defaultValue={currentEditingUser['interviewer_name_last']} onChange={(event) => handleChange(event.target.value, 'interviewer_name_last')} />
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Interviewer Email</Form.Label>
                                <Form.Control defaultValue={currentEditingUser['interviewer_email']} onChange={(event) => handleChange(event.target.value, 'interviewer_email')} />
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Social Link</Form.Label>
                                <Form.Control defaultValue={currentEditingUser['social_link']} onChange={(event) => handleChange(event.target.value, 'social_link')} />
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Similarity</Form.Label>
                                <Form.Control defaultValue={currentEditingUser['similarity']} onChange={(event) => handleChange(event.target.value, 'similarity')} />
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Verify Result</Form.Label>
                                <Form.Control defaultValue={currentEditingUser['verify_result']} onChange={(event) => handleChange(event.target.value, 'verify_result')} />
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Date Of Interview</Form.Label>
                                <Form.Control type="datetime-local" defaultValue={currentEditingUser['date_of_interview']} onChange={(event) => handleChange(event.target.value, 'date_of_interview')} />
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Verify Photo</Form.Label>
                                <Form.Control defaultValue={currentEditingUser['verify_photo']} onChange={(event) => handleChange(event.target.value, 'verify_photo')} />
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Verify IDcard</Form.Label>
                                <Form.Control defaultValue={currentEditingUser['verify_idcard']} onChange={(event) => handleChange(event.target.value, 'verify_idcard')} />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={() => setShowEditView(false)} variant="secondary">Cancel</Button>
                        <Button onClick={() => update()} variant="primary">Update</Button>
                    </Modal.Footer>
                </Modal.Dialog>
            );
        }
    }

    return (
        <Router>
            {isLoading ? <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    textAlign: 'center',
                    backgroundColor: 'rgba(16, 16, 16, 0.5)',
                    zIndex: 999
                }}>
                <Spinner style={{ textAlign: 'center', marginTop: '30%' }} animation="border" />
            </div> : null}
            <Table style={{ tableLayout: 'fixed' }} striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Candidate First Name</th>
                        <th>Candidate Last Name</th>
                        <th>Candidate Email</th>
                        <th>Photo Verification</th>
                        <th>ID Verification</th>
                        <th>Result Verification</th>
                        <th>Interview Date</th>
                        <th>Social Link</th>
                        <th>Interviewer First Name</th>
                        <th>Interviewer Last Name</th>
                        <th>Interviewer Email</th>
                        <th>Similarity</th>
                        <th>Action</th>
                    </tr>
                </thead>
                {(!error) ?
                    <tbody>
                        {users.map((user, index) => {
                            return (
                                <tr key={index} style={{ lineBreak: 'anywhere' }}>
                                    <td>{index + 1}</td>
                                    <td>{user['candidate_name_first'] ? user['candidate_name_first'] : '--'}</td>
                                    <td>{user['candidate_name_last'] ? user['candidate_name_last'] : '--'}</td>
                                    <td>{user['candidate_email'] ? user['candidate_email'] : '--'}</td>
                                    <td>{user['verify_photo'] ? user['verify_photo'] : '--'}</td>
                                    <td>{user['verify_idcard'] ? user['verify_idcard'] : '--'}</td>
                                    <td>{user['verify_result'] ? user['verify_result'] : '--'}</td>
                                    <td>{user['date_of_interview'] ? user['date_of_interview'] : '--'}</td>
                                    <td>{user['social_link'] ? user['social_link'] : '--'}</td>
                                    <td>{user['interviewer_name_first'] ? user['interviewer_name_first'] : '--'}</td>
                                    <td>{user['interviewer_name_last'] ? user['interviewer_name_last'] : '--'}</td>
                                    <td>{user['interviewer_email'] ? user['interviewer_email'] : '--'}</td>
                                    <td>{user['similarity'] ? user['similarity'] : '--'}</td>
                                    <td>
                                        <ButtonGroup size="sm">
                                            <Button onClick={() => editItem(index)}><i className="fa fa-pencil-square-o"></i></Button>
                                            <Button onClick={() => deleteItem(index)} variant="danger"><i className="fa fa-trash"></i></Button>
                                        </ButtonGroup>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody> : null}
            </Table>
            {error ? <Alert style={{ marginTop: 20 }} variant="danger">{error}!</Alert> : null}
            {deleteConfermation()}
            {editUserView()}
        </Router>
    );
}

export default withRouter(AdminPage);