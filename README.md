# Generate Nextcloud test matrix'

Generate a test matrix with Nextcloud and PHP versions based on version ranges

## Inputs

* **Required** ``min-php-version``: Minimum PHP version, e.g. '8.0'.
* **Required** ``max-php-version``: Maximum PHP version, e.g. '8.0'.
* **Optional** `min-nextcloud-version`: Minimum PHP version, e.g. 'master' or '25'.
* **Optional** `min-nextcloud-version`: Maximum PHP version, e.g. 'master' or '27'.

## Usage

### Set up environment for unit tests

These tests only need the Nextcloud code and PHP.

```yaml
  test-unit-matrix:
    runs-on: ubuntu-latest
    name: Matrix for test-unit
    outputs:
      matrix: ${{ steps.matrix.outputs.matrix }}
    steps:
      - uses: actions/checkout@v3
      - uses: ./
        id: matrix
        with:
          min-nextcloud-version: '26'
          max-nextcloud-version: '27'
          min-php-version: '8.1'
          max-php-version: '8.2'
  test-unit:
    needs: test-unit-matrix
    runs-on: ubuntu-latest
    name: Unit test with NC=${{ matrix.nextcloudVersion }} PHP=${{ matrix.phpVersion }}
    strategy:
      matrix:
        include: ${{ fromJSON(needs.test-unit-matrix.outputs.matrix) }}
    steps:
      - name: Set up Nextcloud env
        uses: ChristophWurst/setup-nextcloud@v0.3.1
        with:
          nextcloud-version: ${{ matrix.nextcloudVersion }}
          php-version: ${{ matrix.phpVersion }}
```
