console.log('hello world');

const containers = Array.prototype.slice.call(document.getElementsByClassName("computational-env"));
const envs = containers
    .map(cntr => new ComputationalEnv(cntr));

// <iframe style="width:100%; height:100%" src="http://localhost:5000" frameborder="0"></iframe>
