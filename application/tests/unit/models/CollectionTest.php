<?php
/**
 * @version $Id$
 * @copyright Center for History and New Media, 2007-2010
 * @license http://www.gnu.org/licenses/gpl-3.0.txt
 * @package Omeka
 */

/**
 * 
 *
 * @package Omeka
 * @copyright Center for History and New Media, 2007-2010
 */
class CollectionTest extends PHPUnit_Framework_TestCase
{
    const COLLECTION_ID = 1;
    const ENTITY_ID = 2;
    const RELATIONSHIP_ID = 3;
    const ENTITY_RELATION_ID = 4;
    
    public function setUp()
    {
        $this->dbAdapter = new Zend_Test_DbAdapter;
        $this->db = new Omeka_Db($this->dbAdapter);
        $this->pluginBroker = new Omeka_Plugin_Broker;
        $this->collection = new Collection($this->db);
        $this->profilerHelper = new Omeka_Test_Helper_DbProfiler($this->dbAdapter->getProfiler(), $this);
    }
    
    public function testHasNoCollectors()
    {
        $this->assertFalse($this->collection->hasCollectors());
    }
    
    public function testHasSomeCollectors()
    {
        $this->dbAdapter->appendStatementToStack(Zend_Test_DbStatement::createSelectStatement(array(array(1))));        
        $this->assertTrue($this->collection->hasCollectors());
    }
    
    public function testTotalItemsGetsCountFromItemsTable()
    {
        $this->collection->totalItems();
        $this->profilerHelper->assertDbQuery("SELECT COUNT(DISTINCT(i.id)) FROM items AS i");
    }
    
    public function testTotalItems()
    {
        $this->dbAdapter->appendStatementToStack(Zend_Test_DbStatement::createSelectStatement(array(array(3))));        
        $this->assertEquals(3, $this->collection->totalItems());
    }
    
    public function testGetCollectorsEmpty()
    {
        $this->assertEquals(array(), $this->collection->getCollectors());
    }
    
    public function testGetCollectorEntities()
    {
        $this->dbAdapter->appendStatementToStack(Zend_Test_DbStatement::createSelectStatement(
            array(
                array(
                    'first_name' => 'Foobar',
                    'last_name' => 'Foobar',
                    'institution' => 'Whatever, Inc.',
                    'email' => 'foobar@example.com',
                )
            )
        ));                
        $this->collection->id = self::COLLECTION_ID;
        $entities = $this->collection->getCollectors();
        $this->assertEquals(1, count($entities));
        $this->assertThat($entities[0], $this->isInstanceOf('Entity'));
    }
    
    public function testGetCollectorStrings()
    {
        $this->markTestIncomplete();
    }
        
    public function testDefaultCollectionNameNotValid()
    {
        $this->assertFalse($this->collection->isValid());
        $this->assertContains("Name: The collection name must have between", 
            (string)$this->collection->getErrors());
    }
    
    public function testCollectionNameTooLong()
    {
        $this->collection->name = str_repeat('a', 256);
        $this->assertFalse($this->collection->isValid());
        $this->assertContains("Name: The collection name must have between", 
            (string)$this->collection->getErrors());
    }
    
    public function testValidCollectionName()
    {
        $this->collection->name = str_repeat('b', 150);
        $this->assertTrue($this->collection->isValid());
    }
        
    public function testRemoveCollectorByEntity()
    {   
        $this->collection->id = self::COLLECTION_ID;
        $entity = new Entity($this->db);
        $entity->first_name = 'Foobar';
        $entity->last_name = 'LastName';
        $entity->id = self::ENTITY_ID;
        // It queries the entity_relationships ID before running the DELETE query
        // on entities_relations.
        $this->dbAdapter->appendStatementToStack(Zend_Test_DbStatement::createDeleteStatement(2));
        $this->dbAdapter->appendStatementToStack(Zend_Test_DbStatement::createSelectStatement(
            array(
                array(self::RELATIONSHIP_ID)
            )
        ));
        $retVal = $this->collection->removeCollector($entity);
        $this->profilerHelper->assertTotalNumQueries(2);
        $this->profilerHelper->assertDbQuery("DELETE FROM entities_relations");
        $this->assertTrue($retVal);
    }
    
    public function testRemoveCollectorByString()
    {   
        $this->markTestIncomplete();
    }
    
    public function testRemoveCollectorWhenHasNoCollectors()
    {
        $this->collection->id = self::COLLECTION_ID;
        $entity = new Entity($this->db);
        $entity->first_name = 'Foobar';
        $entity->last_name = 'LastName';
        $entity->id = self::ENTITY_ID;
        $this->dbAdapter->appendStatementToStack(Zend_Test_DbStatement::createDeleteStatement(0));
        $this->dbAdapter->appendStatementToStack(Zend_Test_DbStatement::createSelectStatement(
            array(
                array(self::RELATIONSHIP_ID)
            )
        ));
        $this->assertFalse($this->collection->removeCollector($entity));
    }
    
    public function testAddCollectorByEntity()
    {
        $entity = new Entity($this->db);
        $entity->first_name = 'Foobar';
        $entity->last_name = 'LastName';
        $entity->id = self::ENTITY_ID;
        // Fake the results of 3 SQL statements, only one of which (the middle one)
        // involves saving the entity relation.
        // Note that this will probably break when collections are decoupled from
        // entities.
        $this->dbAdapter->appendStatementToStack(Zend_Test_DbStatement::createInsertStatement(1));
        $this->dbAdapter->appendStatementToStack(Zend_Test_DbStatement::createSelectStatement(
            array(array(self::ENTITY_RELATION_ID))
        ));
        $this->dbAdapter->appendStatementToStack(Zend_Test_DbStatement::createSelectStatement(
            array(array(self::RELATIONSHIP_ID))
        ));
        $this->collection->name = 'foobar';
        $this->collection->addCollector($entity);
        $this->dbAdapter->appendLastInsertIdToStack(self::COLLECTION_ID);
        $this->collection->save();
        // This should actually be a call to hasCollectors(), but that doesn't
        // work, currently.
        $this->profilerHelper->assertDbQuery("INSERT INTO `entities_relations`",
            "Collection should have a collector added to it.");
    }
                
    public function testAddCollectorByString()
    {
        $this->markTestIncomplete();
    }
}