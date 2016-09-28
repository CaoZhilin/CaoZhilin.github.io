var expect = chai.expect;
var should = chai.should;

describe('CGLife', function(){
	it('should be a function', function(){
		assert.isFunction(CGLife);
	});
	it('should have three arguments', function(){
		assert.equal(CGLife.length, 3);
	});
	it("should have Info such as the rows and columns of the map, the living cells' info etc", function(){
		var testGame00 = new CGLife(10, 10, 30);
		assert.equal(testGame00.rows, 10);
		assert.equal(testGame00.columns, 10);
		assert.equal(testGame00.livingCells, 30);
	});
});

describe('creatStartStatus', function(){
	it('should be a function', function(){
		assert.isFunction(createStartStatus);
	});
	it('should have no argument', function(){
		assert.equal(createStartStatus.length, 0);
	});
	var testGame01 = function(){};
	beforeEach(function(){
		testGame01 = new CGLife(10, 10, 30);
		testGame01.dynamicArray = [];
		testGame01.createStartStatus();
	});
	it("should create and init all the cells with their position info and set the cells to be dead at first", function(){
		for (var i = 9; i >= 0; i--) {
			expect(testGame01.cells[i].length).to.be.equal(10);
			for (var j = 9; j >= 0; j--) {
				expect(testGame01.cells[i][j].x).to.be.equal(i);
				expect(testGame01.cells[i][j].y).to.be.equal(j);
			}
		}
	});
	it("should set random cells to be alive according to the given living cell number", function(){
		expect(testGame01.dynamicArray.length).to.be.equal(30);
	});
	it("the dynamicArray(which stores the created living cells) should hold different cells of the target number", function(){
		for (var i = testGame01.dynamicArray.length - 1; i >= 0; i--) {
			for (var j = i - 1; j >= 0; j--) {
				assert.notDeepEqual([testGame01.dynamicArray[i]['x'],testGame01.dynamicArray[i]['y']],[testGame01.dynamicArray[j]['x'],testGame01.dynamicArray[j]['y']]);
			}
		}
	});
});

describe('update', function(){
	it('should be a function', function(){
		assert.isFunction(update);
	});
	it('should have no argument', function(){
		assert.equal(update.length, 0);
	});
	context('update rules', function(){
		var testGame02 = new CGLife(4, 4, 4);
		testGame02.cells[0] = [{x:0,y:0,currentStatus:1,neighborAlive:0}, {x:0,y:1,currentStatus:0,neighborAlive:0}, {x:0,y:2,currentStatus:0,neighborAlive:0}, {x:0,y:3,currentStatus:0,neighborAlive:0}];
		testGame02.cells[1] = [{x:1,y:0,currentStatus:0,neighborAlive:0}, {x:1,y:1,currentStatus:1,neighborAlive:0}, {x:1,y:2,currentStatus:0,neighborAlive:0}, {x:1,y:3,currentStatus:0,neighborAlive:0}];
		testGame02.cells[2] = [{x:2,y:0,currentStatus:0,neighborAlive:0}, {x:2,y:1,currentStatus:1,neighborAlive:0}, {x:2,y:2,currentStatus:1,neighborAlive:0}, {x:2,y:3,currentStatus:0,neighborAlive:0}];
		testGame02.cells[3] = [{x:3,y:0,currentStatus:0,neighborAlive:0}, {x:3,y:1,currentStatus:0,neighborAlive:0}, {x:3,y:2,currentStatus:0,neighborAlive:0}, {x:3,y:3,currentStatus:0,neighborAlive:0}];
		testGame02.dynamicArray = [testGame02.cells[0][0], testGame02.cells[1][1], testGame02.cells[2][2],testGame02.cells[2][1]];	
		console.log(testGame02.dynamicArray);
		testGame02.update();
		console.log(testGame02.dynamicArray);
		it('if a cell has three alive neighbors at present, then the cell should be alive for the next round, no matter whether it is alive for now', function(){
			expect(testGame02.dynamicArray).to.deep.include.members([{x:1,y:0,currentStatus:1,neighborAlive:0},{x:1,y:2,currentStatus:1,neighborAlive:0},{x:3,y:1,currentStatus:1,neighborAlive:0},{x:1,y:1,currentStatus:1,neighborAlive:0}]);
		});
		it("if a cell has two alive neighbors at present, then the cell's life and death won't change", function(){
			expect(testGame02.dynamicArray).to.deep.include.members([{x:2,y:1,currentStatus:1,neighborAlive:0},{x:2,y:2,currentStatus:1,neighborAlive:0}]);
		});
		it('in other cases(expect the former two), no matter the cell is alive or dead, the cell will be dead for the next round', function(){
			expect(testGame02.dynamicArray).to.have.lengthOf(6);
		});
	});
});

describe('random', function(){
	it('should be a function', function(){
		assert.isFunction(random);
	});
	it('should have two arguments', function(){
		assert.equal(random.length, 2);
	});
	var testGame03 = null;
	beforeEach(function(){
		testGame03 = random(1, 10);
	});
	it('the result should be no less than the first variable', function(){
		expect(testGame03).to.at.least(1);
	});
	it('the result should be no greater than the first variable', function(){
		expect(testGame03).to.at.most(10);
	});
});