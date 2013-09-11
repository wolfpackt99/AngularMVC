var app = angular.module('app', ['kendo.directives']).
    controller('invoiceController', ['$scope', 'invoice', '$element', function ($scope, invoice, $element) {

        var fee = $scope.fee;
        var expense = $scope.expense;
        var invoiceData = $scope.invoice;
        var getItemIndex = function (grid, item, source) {
            var index = -1;
            var primaryKey = "id";

            for (var i = 0; i < source.length; i++) {
                if (source[i][primaryKey] === item[primaryKey]) {
                    index = i;
                    break;
                }
            };
            return index;
        };

        function getGrid(grid) {
            var el = $($element).find(grid);
            if (el.length >= 0)
                return $(el).data("kendoGrid");
            return null;
        }
        function bindGrid(grid, source) {
            var el = getGrid(grid);
            el.dataSource.data(source);
        };

        $scope.expenseOptions = {
            columns: ["item", "cost", "quantity", "amount"],
            editable: true,
            save: function (e) { //two way data binding 
                var itemIndex = getItemIndex(getGrid("#expense"), e.model, expense);

                $scope.$apply(function () {
                    for (var p in e.values) {
                        expense[itemIndex][p] = e.values[p];
                    }
                });
            }
        };

        $scope.feeOptions = {
            columns: ["activity", "rate", "hours", "amount"],
            editable: true,
            save: function (e) { //two way data binding 
                var itemIndex = getItemIndex(getGrid("#fee"), e.model, fee);

                $scope.$apply(function () {
                    for (var p in e.values) {
                        fee[itemIndex][p] = e.values[p];
                    }
                });
            }
        };
        invoice.get().then(function (data) {
            invoiceData = data;
            fee = invoiceData.fee;
            expense = invoiceData.expense;
            bindGrid("#expense", expense);
            bindGrid("#fee", fee);
        });

        $scope.total = function() {
            return recalculate();
        };
        
        

        $scope.discount = function() {
            var amt = 0;
            if (invoiceData !== undefined) {
                for (var i = 0; i < invoiceData.discount.length; i++) {
                    amt += invoiceData.discount[i].amount;
                }
            }
            return amt;
        };


        function recalculate() {
            var total = 0;
            if (fee !== undefined) {
                for (var i = 0; i < fee.length; i++) {
                    total += fee[i].amount;
                }
            }
            if (expense != undefined) {
                for (var j = 0; j < expense.length; j++) {
                    total += expense[j].amount;
                }
            }
            return total;

        }
    }]);


