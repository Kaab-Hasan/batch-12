document.getElementById('cv-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const education = document.getElementById('education').value;
    const experience = document.getElementById('experience').value;
    const skills = document.getElementById('skills').value;
    const layout = document.getElementById('layout').value;

    const cvOutput = document.getElementById('cv-output');
    cvOutput.innerHTML = '';

    const cvTemplate = document.createElement('div');
    cvTemplate.className = 'cv-layout active';

    switch (layout) {
        case 'layout1':
            cvTemplate.innerHTML = `
                <h2>${name}</h2>
                <p>Email: ${email}</p>
                <p>Phone: ${phone}</p>
                <p>Address: ${address}</p>
                <h3>Education</h3>
                <p>${education}</p>
                <h3>Experience</h3>
                <p>${experience}</p>
                <h3>Skills</h3>
                <p>${skills}</p>
            `;
            break;
        case 'layout2':
            cvTemplate.innerHTML = `
                <h2>${name}</h2>
                <p><strong>Contact:</strong> ${email} | ${phone} | ${address}</p>
                <h3>Education</h3>
                <p>${education}</p>
                <h3>Experience</h3>
                <p>${experience}</p>
                <h3>Skills</h3>
                <p>${skills}</p>
            `;
            break;
        // Add more cases for other layouts...
        default:
            cvTemplate.innerHTML = `<p>Please select a valid layout.</p>`;
    }

    cvOutput.appendChild(cvTemplate);
});