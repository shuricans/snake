$('document').ready(function () {

    // --- MODAL DIALOG RECORD -------------------------------------------------
    let $mdRecord = $('#mdRecord');
    let $buttonApproveMDRecord = $('#buttonApproveMDRecord');

    $mdRecord.on('show.bs.modal', function (event) {
        noLoop();
        $('#playerScore').val(score);
        $('#playerSpeed').val(speedTextValue);
        let dt = new Date();
        $('#playerDate').val(dt.toLocaleDateString());
    });

    $mdRecord.on('hidden.bs.modal', function () {
        mode = 'endGame';
        loop();
    });

    $buttonApproveMDRecord.click(function () {
        let dt = new Date();
        let result = {
            score: score,
            date: dt.toLocaleDateString(),
            speed: speedTextValue
        };

        let resultData = JSON.parse(localStorage.getItem("results"));
        resultData.push(result);
        localStorage.setItem("results", JSON.stringify(resultData));

        $mdRecord.modal('hide');
        loadResults();
    });

    // --- MODAL DIALOG OK -----------------------------------------------------
    let $mdOK = $('#modalDialogOK');
    let $buttonApproveMDOK = $('#buttonApproveMDOK');

    function initAndShowModalDialogOK(message) {
        $('#contentModalDialogOK').html(message);
        $mdOK.modal('show');
    }

    $buttonApproveMDOK.click(function () {
        $mdOK.modal('hide');
    });

    // --- INIT TABLE RESULTS --------------------------------------------------
    let $tableResults = $('#tableResults').DataTable({
        scrollY: '30vh',
        scrollCollapse: true,
        paging: false,
        info: false,
        searching: false,

        columnDefs: [
            {
                targets: 0,
                defaultContent: '',
                searchable: false,
                orderable: false
            },
            {
                targets: 1,
                data: "score",
            },
            {
                targets: 2,
                data: "speed",
            },
            {
                targets: 3,
                data: "date",
            }
        ],
        order: [[1, 'desc']],

        language: {
            emptyTable: "No results for now..."
        }
    });
    $tableResults.on('order.dt search.dt', function () {
        $tableResults.column(0, {search: 'applied', order: 'applied'}).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
        });
    }).draw();

    function loadResults() {
      if (localStorage.getItem("results"))  {
          let resultData = JSON.parse(localStorage.getItem("results"));
          if(resultData.length > 0) {
            $tableResults.clear();
            $tableResults.rows.add(resultData);
            $tableResults.draw();
          }
      } else {
          localStorage.setItem("results", JSON.stringify([]));
      }
    }

    loadResults();

    // --- INIT TABLE SETTINGS -------------------------------------------------
    $('#tableSettings').DataTable({
        paging: false,
        info: false,
        searching: false,
        ordering:  false
    });

    initAndShowModalDialogOK('<h5>Arrow keys left/right - speed select.</h5><h5>Space - start/restart.</h5>');
});

function initAndShowMDRecord() {
    $('#mdRecord').modal('show');
}
