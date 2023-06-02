const core = require('@actions/core');

const nextcloudPhpVersions = {
    25: {
        min: '7.4',
        max: '8.1',
    },
    26: {
        min: '8.0',
        max: '8.2',
    },
    27: {
        min: '8.0',
        max: '8.2',
    },
};
const phpVersions = [
    '7.2',
    '7.3',
    '7.4',
    '8.0',
    '8.1',
    '8.2',
    '8.3',
];

function range(min, max) {
    if (max <= min) {
        return [];
    }

    return [...Array((max-min)+1).keys()].map(i => i + min)
}
function phpVersionRange(min, max) {
    return range(phpVersions.indexOf(min), phpVersions.indexOf(max)).map(idx => phpVersions[idx]);
}
function maxPhp(a, b) {
    return phpVersions[Math.max(
        phpVersions.indexOf(a),
        phpVersions.indexOf(b),
    )];
}
function minPhp(a, b) {
    return phpVersions[Math.min(
        phpVersions.indexOf(a),
        phpVersions.indexOf(b),
    )];
}

try {
    const minNextcloudVersion = core.getInput('min-nextcloud-version');
    const maxNextcloudVersion = core.getInput('max-nextcloud-version');
    const minPhpVersion = core.getInput('min-php-version');
    const maxPhpVersion = core.getInput('max-php-version');
    console.log({
        minNextcloudVersion,
        maxNextcloudVersion,
        minPhpVersion,
        maxPhpVersion,
    })
    if (minNextcloudVersion !== 'master' && !nextcloudPhpVersions[minNextcloudVersion]) {
        core.setFailed("min-nextcloud-version is invalid. Supported values are " + Object.keys(nextcloudPhpVersions).join(', '));
        return;
    }
    if (maxNextcloudVersion !== 'master' && !nextcloudPhpVersions[maxNextcloudVersion]) {
        core.setFailed("max-nextcloud-version is invalid. Supported values are " + Object.keys(nextcloudPhpVersions).join(', '));
        return;
    }
    if (!phpVersions.indexOf(minPhpVersion)) {
        core.setFailed("min-php-version is invalid. Supported values are " + phpVersions.join(', '));
        return;
    }
    if (!phpVersions.indexOf(maxPhpVersion)) {
        core.setFailed("max-php-version is invalid. Supported values are " + phpVersions.join(', '));
        return;
    }

    let matrix = [];
    if (minNextcloudVersion === 'master') {
        // It doesn't get newer than master
        matrix = phpVersionRange(minPhpVersion, maxPhpVersion).map(phpVersion => ({
            nextcloudVersion: minNextcloudVersion,
            phpVersion,
        }));
    } else {
        range(parseInt(minNextcloudVersion, 10), parseInt(maxNextcloudVersion, 10)).map(nextcloudVersion => {
            phpVersionRange(
                maxPhp(nextcloudPhpVersions[nextcloudVersion].min, minPhpVersion),
                minPhp(nextcloudPhpVersions[nextcloudVersion].max, maxPhpVersion),
            ).map(phpVersion => matrix.push({
                nextcloudVersion,
                phpVersion,
            }));
        });
    }
    core.setOutput('matrix', matrix);
  } catch (error) {
    core.setFailed(error.message);
  }
