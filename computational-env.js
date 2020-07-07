//const NETSBLOX_URL = `https://dev.netsblox.org`;
const NETSBLOX_URL = `./SnapClient/index.dev.html`;

//window.document.domain = `127.0.0.1`;
class ComputationalEnv {
    constructor(container) {
        const [project, username] = container.getAttribute('data-template').split('/');
        this.template = { username, project };
        this.element = document.createElement('iframe');
        this.element.setAttribute('src', this.getTemplateURL());
        container.appendChild(this.element);
        this.element.onload = () => this.configure();
    }

    getTemplateURL() {
        // For now, we can load it by setting
        const hasExistingProject = false;
        const {username, project} = this.template;
        let qs = 'editMode=true&';

        if (hasExistingProject) {
            // what if the project has been changed outside of the env?
            // TODO
            qs += `action=private&ProjectName=${project}`;
        } else {
            qs += `action=present&Username=${username}&ProjectName=${project}`;
        }
        return `${NETSBLOX_URL}?${qs}`;
    }

    configure() {
        // Check if the user has the given project???
        // Custom code to hide the cloud button here
        // TODO
        console.log(this.element.contentWindow.world);
        console.log('iframe ready');
    }
}
