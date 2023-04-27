$(document).ready(() => {
    $('#serarchOrderBtn').submit((event) => {
        event.preventDefault();
        console.log('getserarchOrderBtn');
        const formData = {
            sdate: $('input[name="startDate"]').val(),
            stime: $('select[name="startTime"]').val(),
            edate: $('input[name="endDate"]').val(),
            etime: $('select[name="endTime"]').val()
        };
        $.ajax({
            type: 'POST',
            url: '/merchant/searchOrder',
            data: JSON.stringify(formData),
            contentType: 'application/json',
            success: (data) => {
                $('#result').text(data);
            },
            error: (xhr, status, error) => {
                alert(xhr.responseText);
                res.status(500).send('Something broke!');
            }
        });
    });
});
