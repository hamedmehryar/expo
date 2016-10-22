<?php
/**
 * This file is a part of virtual exposition project.
 *
 * @author  hamedmehryar
 */

namespace App\Repositories;


use Illuminate\Contracts\Queue\EntityNotFoundException;
use Illuminate\Database\Eloquent\Model;

abstract class EloquentRepository
{
    /**
     * @var \Illuminate\Database\Eloquent\Model
     */
    protected $model;

    /**
     * EloquentRepository constructor.
     * @param null $model
     */
    public function __construct($model = null)
    {
        $this->model = $model;
    }

    /**
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function getModel()
    {
        return $this->model;
    }

    /**
     * @param $model
     */
    public function setModel($model)
    {
        $this->model = $model;
    }

    /**
     * @return \Illuminate\Database\Eloquent\Collection|static[]
     */
    public function getAll()
    {
        return $this->model->all();
    }

    /**
     * @param $count
     * @return mixed
     */
    public function getAllPaginated($count)
    {
        return $this->model->paginate($count);
    }

    /**
     * @param $id
     * @return mixed
     */
    public function getById($id)
    {
        return $this->model->find($id);
    }

    /**
     * @param $id
     * @return mixed
     * @throws EntityNotFoundException
     */
    public function requireById($id)
    {
        $model = $this->getById($id);

        if ( ! $model) {
            throw new EntityNotFoundException;
        }

        return $model;
    }

    /**
     * @param array $attributes
     * @return static
     */
    public function getNew($attributes = [])
    {
        return $this->model->newInstance($attributes);
    }

    /**
     * @param $data
     * @return mixed
     */
    public function save($data)
    {
        if ($data instanceOf Model) {
            return $this->storeEloquentModel($data);
        } elseif (is_array($data)) {
            return $this->storeArray($data);
        }
    }

    /**
     * @param $model
     * @return mixed
     */
    public function delete($model)
    {
        return $model->delete();
    }

    /**
     * @param $model
     * @return mixed
     */
    protected function storeEloquentModel($model)
    {
        if ($model->getDirty()) {
            return $model->save();
        } else {
            return $model->touch();
        }
    }

    /**
     * @param $data
     * @return mixed
     */
    protected function storeArray($data)
    {
        $model = $this->getNew($data);
        return $this->storeEloquentModel($model);
    }
}