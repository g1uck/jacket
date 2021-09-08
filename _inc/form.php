<?php
/* header('Content-Type: application/json; charset=utf-8'); */

$data = array(
    'get' => $_GET,
    'post' => $_POST,
    'files' => $_FILES,
    'error' => false,
    'status' => 'ok',
    'message' => false,
    'redirect' => false,
    'snackbarText' => 'This item already has the label "travel". You can add a new label.',
    'snackbarButton' => 'ok'
);

echo json_encode($data);