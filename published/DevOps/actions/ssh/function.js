function(
command,
ellipsis
) {
'use strict';

const SSH = require('simple-ssh');
const Q = require('q');

const cmd = command;
// comma separated list of servers IPs or DNS name
const hosts = [];

if (hosts.length === 0) {
  ellipsis.error("You need to specify the server(s) that run the ssh command. Set the hosts variable in the behavior code");
}

function runSshCommand(cmd, sshParams) {
  var deferred = Q.defer();
  var ssh = new SSH({
    host: sshParams.host,
    user: sshParams.username,
    key: sshParams.key
  });
  function onOutput(stdout) {
    deferred.resolve({ host: sshParams.host, output: stdout });
  }
  function onErr(stderr) {
    deferred.reject({ host: sshParams.host, output: stderr });
  }
  ssh.on('error', function(err) {
    ssh.end();
    deferred.reject({ host: sshParams.host, output: err });
  });
  ssh
    .exec(cmd, { out: onOutput, err: onErr})
    .start();
  return deferred.promise;
}

function runCmdOnHosts(hosts) {
  var sshParams = {
    username: ellipsis.env.SSH_USERNAME,
    key: ellipsis.env.SSH_PRIVATE_KEY
  }
  var promises = []

  for (let h of hosts) {
    var params = Object.assign({host: h}, sshParams);
    promises.push(runSshCommand(cmd, params ));
  }
  return Q.all(promises);
}
runCmdOnHosts(hosts)
  .then(function (output) {
    ellipsis.success(output);
  }, function (error) {
     ellipsis.error(JSON.stringify(error));
  });

}
