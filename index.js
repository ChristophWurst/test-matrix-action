const core = require('@actions/core');

function generateMatrix(parameters) {
    return Object.keys(parameters).reduce((carry, parameterName) => {
        const parameter = parameters[parameterName]
        const permutations = [];
        carry.forEach((vec) => {
            parameter.forEach((parameter) => {
                permutations.push(vec.concat([parameter]));
            });
        });
        return permutations;
    }, [[]]);
}

function selectGreedy(matrix, parameters) {
    const results = [matrix[0]];
    matrix.forEach((vec) => {
        results.forEach((result) => {
          if (!Object.values(parameters).every((parameter, idx) => {
            return results.some((r) => r[idx] === vec[idx])
          })) {
            results.push(vec);
          }
        });
    });
    return results;
}

function mapVectorsToObjects(matrix, parameters) {
    return matrix.map((vec) => {
        const object = {};
        Object.keys(parameters).forEach((parameter, idx) => {
            object[parameter] = vec[idx]
        });
        return object;
    })
}

try {
    const parametersJson = core.getInput('parameters');
    const parameters = JSON.parse(parametersJson);
    if (typeof parameters !== 'object') {
        throw new Error('Parameters have to be a JSON object')
    }

    let matrix = generateMatrix(parameters)
    let minimized = selectGreedy(matrix, parameters)
    let mapped = mapVectorsToObjects(minimized, parameters)
    core.setOutput('matrix', mapped);
  } catch (error) {
    core.setFailed(error.message);
  }
